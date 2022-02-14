const { BrowserWindow, screen, ipcMain } = require('electron');

class MainWindow {
  // 静态属性对所有实例都有效
  static window;
  static _registered = false; // 是否已注册了 IPC

  // 展开时主窗口相关的尺寸
  static itemHeight = 60;
  static width = 150;

  // 折叠为图标时的尺寸
  _foldWidth = 36;
  _foldHeight = 36;

  // 展开时的默认尺寸
  _height = 600;

  // 调整后的位置和尺寸
  _currentX;
  _currentY;
  _currentHeight;

  _dev;

  constructor(dev) {
    this._dev = dev;
  }

  createWindow() {
    const [x, y] = this._getRightmost(this._foldWidth, this._foldHeight);

    MainWindow.window = new BrowserWindow({
      width: this._foldWidth,
      height: this._foldHeight,
      x,
      y,
      alwaysOnTop: true,
      hasShadow: false,
      transparent: true,
      frame: false,
      resizable: false,
      skipTaskbar: true,
      type: 'toolbar',
      backgroundColor: '#1d3a7e',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    MainWindow.window.removeMenu();

    MainWindow.window.loadFile('renderer/main-window.html')
      .then(() => {
        if (MainWindow._registered) return;

        this._handleFold();
        this._onBounds();
        MainWindow._registered = true;
      });

    this._dev && MainWindow.window.webContents.openDevTools();

    return this;
  }

  _getRightmost(width, height) {
    const {
      width: screenWidth,
      height: screenHeight
    } = screen.getPrimaryDisplay().size;

    const x = Math.trunc(screenWidth - width);
    const y = Math.trunc((screenHeight - height) / 2);
    return [x, y];
  }

  _handleFold() {
    ipcMain.handle('fold', async (event, fold) => {
      if (fold) {
        const [x, y] = this._getRightmost(
          this._foldWidth, this._foldHeight);

        MainWindow.window.setBounds({
          x, y, width: this._foldWidth, height: this._foldHeight
        });
      } else {
        if (this._currentX && this._currentY && this._currentHeight) {
          MainWindow.window.setBounds({
            x: this._currentX, y: this._currentY,
            width: MainWindow.width, height: this._currentHeight
          });
        } else {
          const banItems = await MainWindow.window.webContents
            .executeJavaScript('localStorage.getItem("ban");');

          this._adjustBounds(banItems);
        }
      }
    });
  }

  _onBounds() {
    ipcMain.on('bounds-adjust', (e, banItems) => {
      // 因通过窗口关闭事件触发，故需排除当前窗口已被关闭的情形
      if (MainWindow.window.isDestroyed()) return;

      this._adjustBounds(banItems);
    });
  }

  _adjustBounds(banItems) {
    // 调整页面内容
    MainWindow.window.send('ban-adjust');

    // 复位
    this._reset();

    // 调整窗口尺寸
    const items = banItems && JSON.parse(banItems);
    if (items && items.length > 0) {
      const height =
        this._height - items.length * MainWindow.itemHeight;

      const [x, y] = this._getRightmost(MainWindow.width, height);

      window.setBounds({
        x, y, width: MainWindow.width, height: height
      });

      this._currentX = x;
      this._currentY = y;
      this._currentHeight = height;
    }
  }

  _reset() {
    const [x, y] = this._getRightmost(MainWindow.width, this._height);

    MainWindow.window.setBounds({
      x, y, width: MainWindow.width, height: this._height
    });

    this._currentX = x;
    this._currentY = y;
    this._currentHeight = this._height;
  }
}

module.exports = MainWindow;
