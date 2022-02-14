const { ipcMain, screen } = require('electron');

class Ipc {
  constructor() {
    this._getScreenSize();
  }

  _getScreenSize() {
    ipcMain.handle('screen-size',
      () => screen.getPrimaryDisplay().size);
  }
}

module.exports = Ipc;
