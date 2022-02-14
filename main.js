const { app } = require('electron');

const AppAutoLaunch = require('./main/app-auto-launch');
const AppTray = require('./main/app-tray');
const MainWindow = require('./main/main-window');
const WindowCreator = require('./main/window-creator');

const Ipc = require('./main/ipc');

// 托盘图标，需定义为全局变量，防止被垃圾回收
let tray;

class Main {
  _mainWindow;

  constructor() {
    this._fixTransparentWindowForLinux();
    this._autoLaunch();
    this._preventMultiStart();
  }

  _fixTransparentWindowForLinux() {
    // Linux 下需禁用 GPU 渲染，否则透明窗口将失效
    if (process.platform === 'linux')
      app.disableHardwareAcceleration();
  }

  _autoLaunch() {
    // 注册开机自启动（无需适配 MacOS）
    if (process.platform !== 'darwin')
      new AppAutoLaunch().enable();
  }

  _preventMultiStart() {
    // 防止应用多开
    const lock = app.requestSingleInstanceLock();

    if (!lock) {
      // 如已存在运行中的应用，则直接退出当前程序
      app.quit();
    } else {
      app.whenReady().then(() => {
        const focusWindow = this._createMainWindow();

        tray = new AppTray(focusWindow).tray;

        // 当打开第二个应用时，聚焦主窗口
        app.on('second-instance', focusWindow);

        new WindowCreator();
        new Ipc();
      });
    }
  }

  _createMainWindow() {
    this._mainWindow = new MainWindow(false).createWindow();

    // 返回显示并聚焦主窗口的回调函数
    return () => {
      if (!this._mainWindow || MainWindow.window.isDestroyed()) {
        this._mainWindow.createWindow();
      }

      MainWindow.window.focus();
      MainWindow.window.moveTop();
    };
  }
}

new Main();
