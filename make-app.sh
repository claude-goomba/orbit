#!/bin/bash
set -e
cd "$(dirname "$0")"
echo "Building OpenBrowser as a real macOS app with its own window (Electron)..."
./electron-app/build-app.sh
