const { BrowserWindow, ipcMain } = require('electron');

class BaseWindow {
  window;

  _dev;
  _file;
  _width;
  _height;
  _resizable;

  constructor({
    dev, file,
    width = 842, height = 462, resizable = false
  }) {
    this._dev = dev;
    this._file = file;
    this._width = width;
    this._height = height;
    this._resizable = resizable;
  }

  createWindow() {
    this.window = new BrowserWindow({
      width: this._width,
      height: this._height,
      resizable: this._resizable,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    this.window.removeMenu();

    this.window.loadFile(this._file);

    this._dev && this.window.webContents.openDevTools();
  }

  onWindow(channel, createWindow) {
    ipcMain.on(channel, () => {
      if (!this.window || this.window.isDestroyed())
        createWindow();
      else if (this.window && !this.window.isDestroyed()) {
        this.window.focus();
      }
    });
  }
}

module.exports = BaseWindow;
