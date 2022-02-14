const { ipcRenderer, desktopCapturer } = require('electron');

const CanvasDraw = require('./canvas-draw');

class Main {
  _quitEl = document.getElementById('js-quit');
  _toolbarEl = document.getElementById('js-toolbar');
  _foldEl = document.getElementById('js-fold');
  _unfoldEl = document.getElementById('js-unfold');
  _saveEl = document.getElementById('js-save');
  _completeEl = document.getElementById('js-complete');

  _scale = window.devicePixelRatio;

  constructor() {
    new CanvasDraw();

    this._handleQuitClick();
    this._handleCloseClick();
    this._handleOpenClick();
    this._handleSaveClick();
    this._handleCompleteClick();
  }

  // 完成：将批注内容截屏保存在本地并退出
  _handleCompleteClick() {
    this._completeEl.addEventListener('click', () => {
      this._saveFile(this._quit);
    });
  }

  // 保存：将批注内容截屏保存在本地
  _handleSaveClick() {
    this._saveEl.addEventListener('click', () => {
      this._saveFile();
    });
  }

  _saveFile(cb) {
    desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: window.innerWidth * this._scale,
        height: window.innerHeight * this._scale
      }
    }).then(sources => {
      const screenshot = sources[0].thumbnail.toJPEG(100);

      ipcRenderer.invoke('draw-save', {
        filename: `${Date.now()}.jpg`,
        data: screenshot
      }).then(msg => {
        alert(msg);
        cb && cb();
      });
    });
  }

  _handleQuitClick() {
    this._quitEl.addEventListener('click', () => {
      this._quit();
    });
  }

  _quit() {
    window.close();
  }

  _handleCloseClick() {
    this._foldEl.addEventListener('click', () => {
      this._foldToolbar(true);
    });
  }

  _handleOpenClick() {
    this._unfoldEl.addEventListener('click', () => {
      this._foldToolbar(false);
    });
  }

  _foldToolbar(folded) {
    if (folded) {
      const toolbarClasses = this._toolbarEl.classList;
      if (!toolbarClasses.contains('hidden'))
        toolbarClasses.add('hidden');

      this._unfoldEl.classList.remove('hidden');
    } else {
      const toolbarClasses = this._unfoldEl.classList;
      if (!toolbarClasses.contains('hidden'))
        toolbarClasses.add('hidden');

      this._toolbarEl.classList.remove('hidden');
    }
  }
}

new Main();
