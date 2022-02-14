const MenuWindow = require('./menu-window');
const SettingWindow = require('./setting-window');
const DrawWindow = require('./draw-window');
const PreviewWindow = require('./preview-window');
const MatrixWindow = require('./matrix-window');
const EnvWindow = require('./env-window');
const EquipmentWindow = require('./equipment-window');
const PrivacyWindow = require('./privacy-window');
const SignWindow = require('./sign-window');
const EvidenceWindow = require('./evidence-window');
const SupportWindow = require('./support-window');

class WindowCreator {
  constructor() {
    new MenuWindow(false);
    new SettingWindow(false);
    new DrawWindow(false);
    new PreviewWindow(false);
    new MatrixWindow(false);
    new EnvWindow(false);
    new EquipmentWindow(false);
    new PrivacyWindow(false);
    new SignWindow(false);
    new EvidenceWindow(false);
    new SupportWindow(false);
  }
}

module.exports = WindowCreator;
