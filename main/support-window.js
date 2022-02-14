const BaseWindow = require('./base-window');

class EvidenceWindow extends BaseWindow {
  constructor(dev) {
    super({
      width: 360,
      height: 646,
      dev,
      file: 'renderer/support-window.html'
    });

    this._onWindow();
  }

  _onWindow() {
    this.onWindow('support', () => this.createWindow());
  }
}

module.exports = EvidenceWindow;
