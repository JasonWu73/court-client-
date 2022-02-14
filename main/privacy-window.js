const BaseWindow = require('./base-window');

class EquipmentWindow extends BaseWindow {
  constructor(dev) {
    super({
      dev,
      file: 'renderer/privacy-window.html'
    });

    this._onWindow();
  }

  _onWindow() {
    this.onWindow('privacy', () => this.createWindow());
  }
}

module.exports = EquipmentWindow;
