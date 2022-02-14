const AutoLaunch = require('auto-launch');

class AppAutoLaunch {
  launch;

  constructor() {
    this.launch = new AutoLaunch({
      name: '庭审物联网平台'
    });
  }

  enable() {
    this.launch.enable();
  }

  disable() {
    this.launch.disable();
  }
}

module.exports = AppAutoLaunch;
