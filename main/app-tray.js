const electron = require('electron');
const { Menu, Tray } = electron;
const nativeImage = electron.nativeImage;

const path = require('path');

class AppTray {
  _focusWindow;

  constructor(focusWindow) {
    this._focusWindow = focusWindow;

    this._createTray();
  }

  _createTray() {
    // Windows
    if (process.platform === 'win32')
      this._createIcon('../build/icon.ico');

    // Linux 或 MacOS
    if (process.platform === 'linux' || process.platform === 'darwin')
      this._createIcon('../build/tray@2x.png');
  }

  _createIcon(iconPath) {
    const icon = nativeImage.createFromPath(
      path.join(__dirname, iconPath));
    this.tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
      { label: '显示', click: () => this._focusWindow() },
      { label: '退出', role: 'quit' }
    ]);

    this.tray.setToolTip('庭审物联网平台');
    this.tray.setContextMenu(contextMenu);
  }
}

module.exports = AppTray;
