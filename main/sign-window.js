const BaseWindow = require('./base-window');

class EquipmentWindow extends BaseWindow {
  constructor(dev) {
    super({
      dev,
      file: 'renderer/sign-window.html'
    });

    this._onWindow();
  }

  _onWindow() {
    this.onWindow('sign', () => this.createWindow());
  }
}

module.exports = EquipmentWindow;
