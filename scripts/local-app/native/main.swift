// YORISOU LOCAL APP — native macOS shell.
//
// This is a CONTAINER, not a second Yorisou. The product is the existing Next.js application; this
// file exists so a person double-clicks an icon and gets their own app window, instead of opening a
// terminal and typing a localhost URL into a browser tab that then looks like a web page.
//
// Everything it does: check the release is there, run the owned start script, wait for the runtime
// to report the release identity, show it in a WKWebView, and stop the runtime it owns on quit.
// Deliberately not here: preferences, menus beyond the standard set, update UI, auth handling.
// Lifecycle policy lives in the shell scripts, which the contract tests exercise directly.

import AppKit
import WebKit

// Must match runtime-lib.sh. The scripts themselves live inside the active release, so updating the
// release updates the lifecycle logic too — the bundle only needs to know where to look.
let runtimeRoot = "/Volumes/AI-Work/Runtimes/yorisou"
let volumePath = "/Volumes/AI-Work"
let localURL = URL(string: "http://127.0.0.1:3211/")!
let trustedHost = "127.0.0.1"
// 3211: Kakari owns 3210 on this machine. See runtime-lib.sh.
let trustedPort = 3211

func scriptPath(_ name: String) -> String {
    "\(runtimeRoot)/current/scripts/local-app/\(name)"
}

@discardableResult
func runScript(_ name: String, timeout: TimeInterval) -> (ok: Bool, output: String) {
    let path = scriptPath(name)
    guard FileManager.default.isExecutableFile(atPath: path) else {
        return (false, "Missing or non-executable: \(path)")
    }
    let task = Process()
    task.executableURL = URL(fileURLWithPath: "/bin/bash")
    task.arguments = [path]
    let pipe = Pipe()
    task.standardOutput = pipe
    task.standardError = pipe
    do { try task.run() } catch { return (false, "Could not run \(name): \(error.localizedDescription)") }

    // Bounded wait. A launcher that blocks forever on a wedged start is worse than one that reports
    // failure: the person sees a bouncing icon and no explanation.
    let deadline = Date().addingTimeInterval(timeout)
    while task.isRunning && Date() < deadline { usleep(100_000) }
    if task.isRunning {
        task.terminate()
        return (false, "\(name) did not finish within \(Int(timeout))s")
    }
    let data = pipe.fileHandleForReading.readDataToEndOfFile()
    let out = String(data: data, encoding: .utf8) ?? ""
    return (task.terminationStatus == 0, out)
}

final class AppDelegate: NSObject, NSApplicationDelegate, WKNavigationDelegate, WKUIDelegate {
    var window: NSWindow!
    var webView: WKWebView!
    var statusLabel: NSTextField!
    private var runtimeStarted = false

    func applicationDidFinishLaunching(_ notification: Notification) {
        buildWindow()
        DispatchQueue.global(qos: .userInitiated).async { self.startRuntime() }
    }

    private func buildWindow() {
        // Mobile-first by default because the product is: a 1200px-wide window would show a layout
        // nobody designed. Fully resizable, and macOS remembers the frame via setFrameAutosaveName.
        let rect = NSRect(x: 0, y: 0, width: 480, height: 880)
        window = NSWindow(
            contentRect: rect,
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = "YORISOU"
        window.minSize = NSSize(width: 360, height: 520)
        window.setFrameAutosaveName("YorisouMainWindow")
        window.center()

        let config = WKWebViewConfiguration()
        webView = WKWebView(frame: rect, configuration: config)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.autoresizingMask = [.width, .height]
        webView.setValue(false, forKey: "drawsBackground")

        statusLabel = NSTextField(labelWithString: "Yorisou を起動しています…")
        statusLabel.alignment = .center
        statusLabel.font = NSFont.systemFont(ofSize: 13)
        statusLabel.textColor = .secondaryLabelColor
        statusLabel.frame = NSRect(x: 0, y: rect.height / 2 - 12, width: rect.width, height: 24)
        statusLabel.autoresizingMask = [.width, .minYMargin, .maxYMargin]

        let container = NSView(frame: rect)
        container.addSubview(webView)
        container.addSubview(statusLabel)
        window.contentView = container
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    private func setStatus(_ text: String) {
        DispatchQueue.main.async { self.statusLabel.stringValue = text; self.statusLabel.isHidden = false }
    }

    private func startRuntime() {
        guard FileManager.default.fileExists(atPath: volumePath) else {
            // The SSD is a hard dependency. Say so plainly rather than starting a second runtime on
            // the internal disk that the person does not know exists.
            fail("AI-Work ドライブが見つかりません",
                 "Yorisou のローカル実行環境は外付け SSD（\(volumePath)）にあります。"
                 + "内蔵ディスクに別のコピーを作ることはしません。\n\nドライブを接続してから、もう一度開いてください。")
            return
        }
        guard FileManager.default.fileExists(atPath: "\(runtimeRoot)/current") else {
            fail("インストールが必要です",
                 "有効なリリースが見つかりません。リポジトリで次を実行してください:\n\nnpm run local-app:install")
            return
        }

        setStatus("ローカルランタイムを確認しています…")
        let result = runScript("start.sh", timeout: 120)
        guard result.ok else {
            fail("Yorisou を起動できませんでした", result.output.isEmpty ? "start.sh が失敗しました。" : result.output)
            return
        }
        runtimeStarted = true
        DispatchQueue.main.async {
            self.setStatus("読み込んでいます…")
            self.webView.load(URLRequest(url: localURL))
        }
    }

    private func fail(_ title: String, _ detail: String) {
        DispatchQueue.main.async {
            self.statusLabel.isHidden = true
            let alert = NSAlert()
            alert.alertStyle = .critical
            alert.messageText = title
            alert.informativeText = detail
            alert.addButton(withTitle: "終了")
            alert.runModal()
            NSApp.terminate(nil)
        }
    }

    // MARK: navigation

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        statusLabel.isHidden = true
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        setStatus("読み込みに失敗しました: \(error.localizedDescription)")
    }

    func webView(_ webView: WKWebView,
                 decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else { decisionHandler(.cancel); return }
        // Local Yorisou stays in the window; anything else opens in the real browser. Embedding
        // arbitrary external sites in an app chrome the user cannot inspect is how a webview shell
        // becomes a phishing surface — and provider flows such as LINE OAuth are browser-mediated on
        // purpose, not something to work around here.
        if url.host == trustedHost && (url.port ?? trustedPort) == trustedPort {
            decisionHandler(.allow)
        } else {
            decisionHandler(.cancel)
            if url.scheme == "http" || url.scheme == "https" { NSWorkspace.shared.open(url) }
        }
    }

    func webView(_ webView: WKWebView,
                 createWebViewWith configuration: WKWebViewConfiguration,
                 for navigationAction: WKNavigationAction,
                 windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let url = navigationAction.request.url { NSWorkspace.shared.open(url) }
        return nil
    }

    // MARK: lifecycle

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }

    func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
        // Stop only what this app started, and only via the script that re-proves ownership. No
        // orphan node process, and no chance of taking down someone else's server on the way out.
        guard runtimeStarted else { return .terminateNow }
        DispatchQueue.global(qos: .userInitiated).async {
            runScript("stop.sh", timeout: 30)
            DispatchQueue.main.async { NSApp.reply(toApplicationShouldTerminate: true) }
        }
        return .terminateLater
    }

    // Re-activating from the Dock brings the existing window forward instead of opening a second
    // one — the app is a single window onto a single runtime.
    func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
        if !flag { window.makeKeyAndOrderFront(nil) }
        return true
    }
}

let app = NSApplication.shared
app.setActivationPolicy(.regular)
let delegate = AppDelegate()
app.delegate = delegate

// A minimal standard menu, so ⌘Q, ⌘W and ⌘M behave the way every other Mac app does.
let mainMenu = NSMenu()
let appMenuItem = NSMenuItem()
mainMenu.addItem(appMenuItem)
let appMenu = NSMenu()
appMenu.addItem(withTitle: "YORISOU について", action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: "")
appMenu.addItem(NSMenuItem.separator())
appMenu.addItem(withTitle: "YORISOU を隠す", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
appMenu.addItem(withTitle: "YORISOU を終了", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
appMenuItem.submenu = appMenu

let windowMenuItem = NSMenuItem()
mainMenu.addItem(windowMenuItem)
let windowMenu = NSMenu(title: "ウインドウ")
windowMenu.addItem(withTitle: "しまう", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
windowMenu.addItem(withTitle: "閉じる", action: #selector(NSWindow.performClose(_:)), keyEquivalent: "w")
windowMenuItem.submenu = windowMenu
app.mainMenu = mainMenu

app.run()
