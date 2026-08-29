const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function pagePath() {
  return path.join(__dirname, 'app', 'index.html');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 800,
    minHeight: 600,
    title: 'Orbit',
    backgroundColor: '#0e0f13',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile(pagePath());
}

ipcMain.on('ob:min', () => { const w = BrowserWindow.getFocusedWindow(); if (w) w.minimize(); });
ipcMain.on('ob:max', () => { const w = BrowserWindow.getFocusedWindow(); if (w) { if (w.isMaximized()) w.unmaximize(); else w.maximize(); } });
ipcMain.on('ob:close', () => { const w = BrowserWindow.getFocusedWindow(); if (w) w.close(); });

function fail(msg) {
  try { dialog.showErrorBox('Orbit', msg); } catch (e) {}
  app.quit();
}

// --- Auto-update scaffolding (to be wired up in a future release) ---
function setupAutoUpdates() {
  if (!process.env.UPDATE_FEED) return;
  let autoUpdater;
  try { autoUpdater = require('electron-updater').autoUpdater; } catch (e) { return; }
  autoUpdater.setFeedURL(process.env.UPDATE_FEED);
  autoUpdater.checkForUpdatesAndNotify().catch(() => {});
}

app.whenReady().then(() => {
  setupAutoUpdates();
  if (!fs.existsSync(pagePath())) {
    fail('Could not find the Lumen page inside the app bundle.');
    return;
  }
  createWindow();
});

app.on('window-all-closed', () => app.quit());
