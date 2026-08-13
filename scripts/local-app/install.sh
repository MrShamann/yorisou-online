#!/bin/bash
# YORISOU LOCAL APP — idempotent install / update.
#
# This is the ONLY path that builds anything. Normal launch serves an already-accepted release; the
# separation is deliberate and load-bearing, because a launcher that builds is a launcher that can
# change what the Founder sees without being asked, and that takes minutes on every double-click.
#
# ORDER MATTERS: the new release is built and validated BEFORE `current` moves. If any step fails,
# `current` still points at the last accepted release and the installed app keeps working. That is
# the whole rollback story — no backup library, just "don't switch until it's proven".
set -u
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$DIR/../.." && pwd)"
. "$DIR/runtime-lib.sh"

SHA="${YORISOU_INSTALL_SHA:-$(cd "$REPO" && git rev-parse HEAD)}"
[ -n "$SHA" ] || yr_die "cannot resolve a commit to install"
RELEASE="$YR_RELEASES/$SHA"
STAGE="$YR_ROOT/.stage"

yr_require_ssd
yr_make_runtime_tree
yr_log "install: target release $SHA"

# ── 1. release worktree at the exact commit ─────────────────────────────────────
# A detached worktree, not a second clone: same object store, no independent remote, and the release
# is pinned to a commit rather than to whatever branch the development repo is on. That separation
# is the point — the Founder's app must not change because someone checked out a feature branch.
if [ ! -d "$RELEASE/.git" ] && [ ! -f "$RELEASE/.git" ]; then
  rm -rf "$RELEASE"
  ( cd "$REPO" && git worktree prune && git worktree add --detach "$RELEASE" "$SHA" ) >/dev/null 2>&1 \
    || yr_die "could not create release worktree for $SHA"
  yr_log "install: created worktree $RELEASE"
else
  yr_log "install: reusing existing worktree $RELEASE"
fi

# ── 2. dependencies + build, inside the release ─────────────────────────────────
export npm_config_cache="$YR_CACHE/npm"
mkdir -p "$npm_config_cache"

cd "$RELEASE" || yr_die "cannot enter $RELEASE"
if [ ! -d node_modules ]; then
  yr_log "install: npm ci (this is the slow step, and it only happens here)"
  npm ci >>"$YR_LOGS/install.log" 2>&1 || yr_die "npm ci failed; see $YR_LOGS/install.log"
else
  yr_log "install: node_modules present, skipping npm ci"
fi

if [ ! -d .next ] || [ "${YORISOU_FORCE_BUILD:-0}" = "1" ]; then
  # Bounded retry, because one specific failure here is external and transient: `next/font/google`
  # downloads Noto Sans JP at build time, and on a slow link those requests time out. Turbopack then
  # reports `Can't resolve '@vercel/turbopack-next/internal/font/google/font'` — a module-resolution
  # error that reads like a code defect and is not one. Observed first-attempt failure and
  # second-attempt success on the same commit and the same machine.
  #
  # This retries the FETCH, never a real failure: a genuine build error fails identically twice and
  # still stops the install, and `current` has not moved yet either way.
  BUILT=0
  for attempt in 1 2; do
    yr_log "install: building release (attempt $attempt)"
    if npm run build >>"$YR_LOGS/install.log" 2>&1; then BUILT=1; break; fi
    yr_log "install: build attempt $attempt failed"
  done
  [ "$BUILT" = "1" ] || yr_die "build failed twice; see $YR_LOGS/install.log"
else
  yr_log "install: .next present, skipping build"
fi

yr_release_is_valid "$RELEASE" || yr_die "release $SHA did not validate after build"

# ── 3. native app bundle, staged ────────────────────────────────────────────────
rm -rf "$STAGE"; mkdir -p "$STAGE"
BUNDLE="$STAGE/YORISOU.app"
mkdir -p "$BUNDLE/Contents/MacOS" "$BUNDLE/Contents/Resources"

yr_log "install: compiling native shell"
swiftc -O -whole-module-optimization \
  -o "$BUNDLE/Contents/MacOS/YORISOU" \
  "$RELEASE/scripts/local-app/native/main.swift" \
  >>"$YR_LOGS/install.log" 2>&1 || yr_die "swiftc failed; see $YR_LOGS/install.log"

yr_log "install: rendering icon from the product's own app/icon.svg"
ICONTOOL="$STAGE/make-icon"
swiftc -O -o "$ICONTOOL" "$RELEASE/scripts/local-app/native/make-icon.swift" \
  >>"$YR_LOGS/install.log" 2>&1 || yr_die "icon tool build failed"
"$ICONTOOL" "$RELEASE/app/icon.svg" "$STAGE/yorisou.iconset" >>"$YR_LOGS/install.log" 2>&1 \
  || yr_die "icon rasterisation failed"
iconutil -c icns "$STAGE/yorisou.iconset" -o "$BUNDLE/Contents/Resources/yorisou.icns" \
  >>"$YR_LOGS/install.log" 2>&1 || yr_die "iconutil failed"

cat > "$BUNDLE/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>YORISOU</string>
  <key>CFBundleDisplayName</key><string>YORISOU</string>
  <key>CFBundleIdentifier</key><string>$YR_BUNDLE_ID</string>
  <key>CFBundleExecutable</key><string>YORISOU</string>
  <key>CFBundleIconFile</key><string>yorisou</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleInfoDictionaryVersion</key><string>6.0</string>
  <key>CFBundleVersion</key><string>1.0.0</string>
  <key>CFBundleShortVersionString</key><string>1.0.0</string>
  <key>LSApplicationCategoryType</key><string>public.app-category.lifestyle</string>
  <key>LSMinimumSystemVersion</key><string>13.0</string>
  <key>NSHighResolutionCapable</key><true/>
  <key>LSUIElement</key><false/>
  <key>NSAppTransportSecurity</key>
  <dict>
    <key>NSAllowsLocalNetworking</key><true/>
  </dict>
</dict>
PLIST
printf '</plist>\n' >> "$BUNDLE/Contents/Info.plist"
printf 'APPL????' > "$BUNDLE/Contents/PkgInfo"

# Validate the STAGED bundle before it goes anywhere near ~/Applications.
[ -x "$BUNDLE/Contents/MacOS/YORISOU" ] || yr_die "staged bundle has no executable"
[ -s "$BUNDLE/Contents/Resources/yorisou.icns" ] || yr_die "staged bundle has no icon"
/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$BUNDLE/Contents/Info.plist" >/dev/null 2>&1 \
  || yr_die "staged bundle Info.plist is malformed"

# ── 4. activate the release (atomic) ────────────────────────────────────────────
# Everything above succeeded, so it is now safe to point `current` at the new release.
# `mv -f tmp current` LOOKS atomic and is not: when `current` is a symlink to a DIRECTORY, mv
# follows it and moves the temp link INSIDE that directory. The activation then silently does not
# happen while reporting success — and because the recorded SHA had already been written, state and
# symlink disagreed, so the app kept serving the previous release's scripts while everything claimed
# the new one was live. Verified by reproducing it, and by an installed app that ran the old code.
#
# `os.replace` is a real rename(2): it replaces the symlink itself, atomically, without following it.
ln -sfn "$RELEASE" "$YR_ROOT/.current.tmp"
python3 -c 'import os,sys; os.replace(sys.argv[1], sys.argv[2])' "$YR_ROOT/.current.tmp" "$YR_CURRENT" \
  || yr_die "could not activate the release symlink"

# Verify the post-condition rather than trusting the command. The whole rollback guarantee rests on
# `current` and the recorded SHA agreeing; an activation that quietly no-ops must not pass as done.
ACTIVE=$(yr_active_release_path) || yr_die "activation left current unreadable"
[ "$ACTIVE" = "$RELEASE" ] || yr_die "activation did not take: current -> $ACTIVE, expected $RELEASE"
printf '%s\n' "$SHA" > "$YR_RELEASE_FILE"
yr_log "install: current -> $RELEASE (verified)"

# ── 5. install the app bundle (atomic swap, old one kept until the new one is in) ─
mkdir -p "$(dirname "$YR_APP_BUNDLE")"
OLD="$YR_APP_BUNDLE.previous"
rm -rf "$OLD"
if [ -d "$YR_APP_BUNDLE" ]; then
  yr_log "install: existing bundle found; moving it aside rather than overwriting"
  mv "$YR_APP_BUNDLE" "$OLD" || yr_die "could not move the existing app aside"
fi
if ! mv "$BUNDLE" "$YR_APP_BUNDLE"; then
  # Put the old one back rather than leaving the Founder with no app at all.
  [ -d "$OLD" ] && mv "$OLD" "$YR_APP_BUNDLE"
  yr_die "could not install the new bundle"
fi
if [ -d "$YR_APP_BUNDLE/Contents/MacOS" ]; then
  rm -rf "$OLD"
else
  [ -d "$OLD" ] && mv "$OLD" "$YR_APP_BUNDLE"
  yr_die "installed bundle failed verification; the previous app was restored"
fi

/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister \
  -f "$YR_APP_BUNDLE" >/dev/null 2>&1 || true
touch "$YR_APP_BUNDLE"

# ── 6. prune ────────────────────────────────────────────────────────────────────
# Keep a small number of recent releases so a rollback target exists; nothing more.
KEEP="$YR_KEEP_RELEASES"
ls -1dt "$YR_RELEASES"/* 2>/dev/null | tail -n +$((KEEP + 1)) | while read -r old; do
  [ "$old" = "$RELEASE" ] && continue
  yr_log "install: pruning old release $(basename "$old")"
  ( cd "$REPO" && git worktree remove --force "$old" ) >/dev/null 2>&1 || rm -rf "$old"
done
( cd "$REPO" && git worktree prune ) >/dev/null 2>&1 || true

rm -rf "$STAGE"
yr_log "install: complete — release $SHA, app at $YR_APP_BUNDLE"
echo
echo "  release  $SHA"
echo "  runtime  $YR_ROOT"
echo "  app      $YR_APP_BUNDLE"
