const { ipcRenderer } = require('electron');

class Main {
  _menu = document.querySelector('.menu');
  _tooltips = document.querySelectorAll('.tooltip');

  constructor() {
    this._show();
    this._toggle();
    this._click();
    this._hover();
  }

  _show() {
    ipcRenderer.invoke('menu-index').then(index => {
      document.getElementById(`index-${index}`).classList
        .remove('hidden');
    });
  }

  _toggle() {
    document.addEventListener('mouseenter', () => {
      ipcRenderer.send('menu', { cancelClose: true });
    });

    document.addEventListener('mouseleave', () => {
      ipcRenderer.send('menu', { directClose: true });
    });
  }

  _click() {
    this._menu.addEventListener('click', e => {
      const channel = e.target.closest('.menu__item').dataset.ipc;
      channel && ipcRenderer.send(channel);
    });
  }

  _hover() {
    let timer;

    this._tooltips.forEach(tooltip => {
      tooltip.addEventListener('mouseenter', async e => {
        const tip = e.currentTarget.querySelector('.tooltip__tip');

        await ipcRenderer.invoke('menu-tooltip', true);

        // 防止界面闪烁
        timer = setTimeout(() => tip.style.display = 'block', 100);
      });

      tooltip.addEventListener('mouseleave', async e => {
        const tip = e.currentTarget.querySelector('.tooltip__tip');

        await ipcRenderer.invoke('menu-tooltip', false);

        timer && clearTimeout(timer);

        tip.style.display = 'none';
      });
    });
  }
}

new Main();
