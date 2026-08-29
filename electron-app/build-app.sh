#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "== Copying Orbit page (index.html, styles.css, app.js) into electron-app/app =="
rm -rf app
mkdir -p app
cp ../orbit/index.html ../orbit/styles.css ../orbit/app.js app/

echo "== Installing Electron (first run downloads the runtime) =="
npm install

echo "== Packaging Orbit.app =="
npm run package

echo "== Placing .app at project root =="
APP_SRC="$(find dist -name 'Orbit.app' -maxdepth 3 | head -1)"
rm -rf ../Orbit.app
cp -R "$APP_SRC" ../Orbit.app
echo ""
echo "Built: ../Orbit.app  (double-click to launch; opens in its own window)."
