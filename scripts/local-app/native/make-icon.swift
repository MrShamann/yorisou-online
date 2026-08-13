// YORISOU LOCAL APP — build the .icns from the app's own approved mark.
//
// Source is app/icon.svg, the icon the product already ships. Nothing is drawn or invented here;
// this only rasterises the existing artwork at the sizes macOS asks for. AppKit is used because it
// is already a hard dependency of the native shell — no ImageMagick, no rsvg, nothing to install.

import AppKit

guard CommandLine.arguments.count == 3 else {
    FileHandle.standardError.write("usage: make-icon <source.svg> <out.iconset>\n".data(using: .utf8)!)
    exit(2)
}
let source = CommandLine.arguments[1]
let outDir = CommandLine.arguments[2]

guard let image = NSImage(contentsOfFile: source) else {
    FileHandle.standardError.write("could not load \(source)\n".data(using: .utf8)!)
    exit(1)
}

try? FileManager.default.createDirectory(atPath: outDir, withIntermediateDirectories: true)

// The set `iconutil` expects. Missing sizes give a bundle whose Dock icon looks soft.
let variants: [(name: String, px: Int)] = [
    ("icon_16x16.png", 16), ("icon_16x16@2x.png", 32),
    ("icon_32x32.png", 32), ("icon_32x32@2x.png", 64),
    ("icon_128x128.png", 128), ("icon_128x128@2x.png", 256),
    ("icon_256x256.png", 256), ("icon_256x256@2x.png", 512),
    ("icon_512x512.png", 512), ("icon_512x512@2x.png", 1024),
]

for variant in variants {
    guard let rep = NSBitmapImageRep(
        bitmapDataPlanes: nil, pixelsWide: variant.px, pixelsHigh: variant.px,
        bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
        colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0
    ) else { exit(1) }
    rep.size = NSSize(width: variant.px, height: variant.px)

    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    NSGraphicsContext.current?.imageInterpolation = .high
    image.draw(in: NSRect(x: 0, y: 0, width: variant.px, height: variant.px),
               from: .zero, operation: .sourceOver, fraction: 1.0)
    NSGraphicsContext.restoreGraphicsState()

    guard let png = rep.representation(using: .png, properties: [:]) else { exit(1) }
    do { try png.write(to: URL(fileURLWithPath: "\(outDir)/\(variant.name)")) }
    catch { FileHandle.standardError.write("write failed: \(error)\n".data(using: .utf8)!); exit(1) }
}

print("iconset written: \(outDir)")
