const BaseWindow = require('./base-window');

class PreviewWindow extends BaseWindow {
  constructor(dev) {
    super({
      dev,
      file: 'renderer/matrix-window.html'
    });

    this._onWindow();
  }

  _onWindow() {
    this.onWindow('matrix', () => this.createWindow());
  }
}

module.exports = PreviewWindow;
