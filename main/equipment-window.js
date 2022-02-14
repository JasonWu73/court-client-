const BaseWindow = require('./base-window');

class EquipmentWindow extends BaseWindow {
  constructor(dev) {
    super({
      dev,
      file: 'renderer/equipment-window.html'
    });

    this._onWindow();
  }

  _onWindow() {
    this.onWindow('equipment', () => this.createWindow());
  }
}

module.exports = EquipmentWindow;
