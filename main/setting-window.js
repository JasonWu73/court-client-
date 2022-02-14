const BaseWindow = require('./base-window');

class EquipmentWindow extends BaseWindow {
  constructor(dev) {
    super({
      dev,
      file: 'renderer/setting-window.html'
    });

    this._onWindow();
  }

  _onWindow() {
    this.onWindow('setting', () => this.createWindow());
  }
}

module.exports = EquipmentWindow;
