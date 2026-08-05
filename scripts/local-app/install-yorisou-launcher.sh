#!/bin/bash
# YORISOU local launcher — reproducible installer (LOCAL-LAUNCHER-REFRESH-1).
#
# Recreates, idempotently, from repository-owned sources:
#   ~/Applications/YORISOU.app            (bundle id jp.yorisou.local.app)
#   ~/Applications/Stop YORISOU.app       (bundle id jp.yorisou.local.stop)
#   ~/Library/Application Support/YORISOU/bin/*   (launcher scripts)
#   ~/Library/Application Support/YORISOU/yorisou.env.local  (template, first install only)
#   ~/Library/Logs/YORISOU/               (launcher.log server.log migration.log stop.log)
#
# Never overwrites an existing env file (it may hold local-only secrets).
# Never touches the local database, Colima, or any running process.

set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
APPSUP="$HOME/Library/Application Support/YORISOU"
LOGS="$HOME/Library/Logs/YORISOU"
APPS="$HOME/Applications"
VERSION="2.1.0"

echo "YORISOU launcher installer (LOCAL-LAUNCHER-REFRESH-1) from: $SRC"

# ── Application Support: scripts ─────────────────────────────────────────────
mkdir -p "$APPSUP/bin" "$APPSUP/run" "$APPSUP/data" "$LOGS"
for f in yorisou-launcher-lib.sh start-yorisou.sh stop-yorisou.sh verify-yorisou-launcher.sh; do
  [ -f "$SRC/$f" ] || { echo "ERROR: missing source script $SRC/$f" >&2; exit 1; }
  install -m 0755 "$SRC/$f" "$APPSUP/bin/$f"
done

# Remove launcher scripts obsoleted by LOCAL-LAUNCHER-REFRESH-1 (the APP-2-era
# common lib, seeding and status/uninstall helpers referenced deleted repo paths).
for f in yorisou-common.sh seed-accounts.sh status-yorisou.sh uninstall-yorisou.sh; do
  if [ -f "$APPSUP/bin/$f" ]; then rm -f "$APPSUP/bin/$f"; echo "removed obsolete: bin/$f"; fi
done

# ── Environment file: create from template on first install only ─────────────
ENVF="$APPSUP/yorisou.env.local"
if [ ! -f "$ENVF" ]; then
  install -m 0600 "$SRC/yorisou.env.local.template" "$ENVF"
  echo "created env file from template: $ENVF (fill in local values)"
else
  # One-time migration: obsolete APP-2/AIX-era pins become comments. Values are
  # not read, printed, or logged; the file keeps its 0600 permissions.
  if grep -qE '^(YORISOU_EXPECTED_BRANCH="feat/aix-1-ai-native-experience"|YORISOU_EXPECTED_HEAD=)' "$ENVF"; then
    sed -i '' \
      -e 's|^YORISOU_EXPECTED_BRANCH="feat/aix-1-ai-native-experience"|# retired by LOCAL-LAUNCHER-REFRESH-1: &|' \
      -e 's|^YORISOU_EXPECTED_HEAD=|# retired by LOCAL-LAUNCHER-REFRESH-1: &|' \
      "$ENVF"
    chmod 600 "$ENVF"
    echo "migrated env file: obsolete branch/head pins commented out"
  fi
  echo "kept existing env file: $ENVF"
fi

# ── Icon: prefer the already-installed icon, fall back to the repo copy ──────
ICON_SRC=""
for c in "$APPS/YORISOU.app/Contents/Resources/yorisou.icns" "$APPSUP/yorisou.icns" "$SRC/assets/yorisou.icns"; do
  if [ -f "$c" ]; then ICON_SRC="$c"; break; fi
done
[ -n "$ICON_SRC" ] || { echo "ERROR: no yorisou.icns found (looked in bundle, Application Support, repo assets)" >&2; exit 1; }

# ── Bundles ──────────────────────────────────────────────────────────────────
make_bundle() {
  name="$1"; bundle_id="$2"; exec_name="$3"; target_script="$4"
  b="$APPS/$name.app"
  mkdir -p "$b/Contents/MacOS" "$b/Contents/Resources"
  cat > "$b/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>$name</string>
  <key>CFBundleDisplayName</key><string>$name</string>
  <key>CFBundleIdentifier</key><string>$bundle_id</string>
  <key>CFBundleVersion</key><string>$VERSION</string>
  <key>CFBundleShortVersionString</key><string>$VERSION</string>
  <key>CFBundleExecutable</key><string>$exec_name</string>
  <key>CFBundleIconFile</key><string>yorisou</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleInfoDictionaryVersion</key><string>6.0</string>
  <key>LSApplicationCategoryType</key><string>public.app-category.lifestyle</string>
  <key>LSMinimumSystemVersion</key><string>12.0</string>
  <key>NSHighResolutionCapable</key><true/>
  <key>LSUIElement</key><false/>
</dict>
</plist>
PLIST
  printf '#!/bin/bash\nexec "$HOME/Library/Application Support/YORISOU/bin/%s"\n' "$target_script" \
    > "$b/Contents/MacOS/$exec_name"
  chmod 0755 "$b/Contents/MacOS/$exec_name"
  printf 'APPL????' > "$b/Contents/PkgInfo"
  if [ "$ICON_SRC" != "$b/Contents/Resources/yorisou.icns" ]; then
    cp -f "$ICON_SRC" "$b/Contents/Resources/yorisou.icns"
  fi
  # Nudge Finder/Dock to refresh the bundle's metadata.
  /usr/bin/touch "$b"
  echo "installed: $b"
}

make_bundle "YORISOU"      "jp.yorisou.local.app"  "YORISOU"     "start-yorisou.sh"
make_bundle "Stop YORISOU" "jp.yorisou.local.stop" "StopYORISOU" "stop-yorisou.sh"

# Keep an icon copy in Application Support so reinstalls survive bundle deletion.
[ -f "$APPSUP/yorisou.icns" ] || cp -f "$ICON_SRC" "$APPSUP/yorisou.icns"

# ── Logs (bounded; created empty so first-launch failures have a home) ───────
for f in launcher.log server.log migration.log stop.log; do
  touch "$LOGS/$f"
done

# ── Verify ───────────────────────────────────────────────────────────────────
"$APPSUP/bin/verify-yorisou-launcher.sh"
echo "install complete (launcher $VERSION)"
