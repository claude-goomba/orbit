const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ob', {
  minimize: () => ipcRenderer.send('ob:min'),
  maximize: () => ipcRenderer.send('ob:max'),
  close: () => ipcRenderer.send('ob:close'),
  isElectron: true,
});
