const BaseWindow = require('./base-window');

class EvidenceWindow extends BaseWindow {
  constructor(dev) {
    super({
      dev,
      file: 'renderer/evidence-window.html'
    });

    this._onWindow();
  }

  _onWindow() {
    this.onWindow('evidence', () => this.createWindow());
  }
}

module.exports = EvidenceWindow;
