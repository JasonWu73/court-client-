const BaseWindow = require('./base-window');

class PreviewWindow extends BaseWindow {
  constructor(dev) {
    super({
      dev,
      resizable: true,
      file: 'renderer/preview-window.html'
    });

    this._onWindow();
  }

  _onWindow() {
    this.onWindow('preview', () => this.createWindow());
  }
}

module.exports = PreviewWindow;
