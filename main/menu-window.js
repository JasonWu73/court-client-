const { BrowserWindow, screen, ipcMain } = require('electron');

const MainWindow = require('./main-window');

class MenuWindow {
  _estimate = 500; // 一个预估的提示框高度可用值

  _dev;
  _window;
  _index;
  _timer;

  constructor(dev) {
    this._dev = dev;

    this._onWindow();
    this._handleMenuIndex();
    this._handleTooltip();
  }

  _onWindow() {
    // 展开菜单
    ipcMain.on('menu', (event, {
      index, width, directClose, waitClose, cancelClose
    }) => {
      // 取消等待关闭窗口的动作
      cancelClose && (clearTimeout(this._timer));

      // 执行直接关闭的动作
      if (directClose) {
        if (this._window && !this._window.isDestroyed()) {
          clearTimeout(this._timer);
          this._window.close();
        }

        return;
      }

      // 设置等待关闭窗口定时器
      if (waitClose) {
        this._timer = setTimeout(() => {
          if (!this._window.isDestroyed()) this._window.close();
        }, 100);

        return;
      }

      // 创建展开菜单
      if (index && width) {
        this._index = index;
        this._createWindow(width);
      }
    });
  }

  _handleMenuIndex() {
    // 获取当前展开菜单是由第几项触发的
    ipcMain.handle('menu-index', () => this._index);
  }

  _handleTooltip() {
    // 为提示框设置合适的窗口尺寸
    ipcMain.handle('menu-tooltip', (event, show) => {
      const height = MainWindow.itemHeight;
      const [width] = this._window.getSize();

      if (show) this._window.setSize(width, height + this._estimate);
      else this._window.setSize(width, height);
    });
  }

  _createWindow(width) {
    const [x, y] = this._getRightmost(width);

    this._window = new BrowserWindow({
      width,
      height: MainWindow.itemHeight,
      x,
      y,
      alwaysOnTop: true,
      transparent: true,
      frame: false,
      resizable: false,
      hasShadow: false,
      skipTaskbar: true,
      type: 'toolbar',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    this._window.removeMenu();

    this._window.loadFile('renderer/menu-window.html');

    this._dev && this._window.webContents.openDevTools();
  }

  _getRightmost(currentWidth) {
    const { width } = screen.getPrimaryDisplay().size;
    const x = Math.trunc(width - MainWindow.width - currentWidth);

    const [, mainY] = MainWindow.window.getPosition();
    const y = Math.trunc(mainY + MainWindow.itemHeight * this._index);
    return [x, y];
  }
}

module.exports = MenuWindow;
