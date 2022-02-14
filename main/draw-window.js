const {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  dialog
} = require('electron');

const fs = require('fs');

class DrawWindow {
  _dev;
  _window;

  constructor(dev) {
    this._dev = dev;

    this._onWindow();
    this._handleSave();
  }

  _onWindow() {
    ipcMain.on('draw', () => this._createWindow());
  }

  _handleSave() {
    ipcMain.handle('draw-save', async (event, { filename, data }) => {
      return new Promise((resolve, reject) => {
        dialog.showSaveDialog(this._window, {
          defaultPath: `${app.getPath('desktop')}/${filename}`
        }).then(({ canceled, filePath }) => {
          if (canceled || !filePath) return;

          fs.writeFile(filePath, data, err => {
            if (err) reject(err.message);

            resolve('保存成功');
          });
        });
      });
    });
  }

  _createWindow() {
    const { width, height, x, y } = screen.getPrimaryDisplay().bounds;

    this._window = new BrowserWindow({
      width,
      height,
      x,
      y,
      hasShadow: false,
      transparent: true,
      frame: false,
      movable: false,
      resizable: false,
      // Windows 下必须配置，MacOS 下不需要（否则会打开一个全屏新桌面）
      fullscreen: process.platform !== 'darwin',
      // 使覆盖全屏幕，包含 MacOS Menu Bar
      enableLargerThanScreen: true,
      // Windows 下必须配置 `toolbar`，否则会禁用视频播放
      type: 'toolbar',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    this._window.removeMenu();

    // 使覆盖全屏幕，包含 MacOS Menu Bar
    this._window.setAlwaysOnTop(true, 'screen-saver');

    this._window.loadFile('renderer/draw-window.html');

    this._dev && this._window.webContents.openDevTools();
  }
}

module.exports = DrawWindow;
