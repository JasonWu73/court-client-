const BaseWindow = require('./base-window');

class EnvWindow extends BaseWindow {
  constructor(dev) {
    super({
      dev,
      file: 'renderer/env-window.html'
    });

    this._onWindow();
  }

  _onWindow() {
    this.onWindow('env', () => this.createWindow());
  }
}

module.exports = EnvWindow;
