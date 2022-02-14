const { ipcRenderer } = require('electron');

class Main {
  static _menuItemWidth = 70;

  _fold = document.querySelector('.fold');
  _container = document.querySelector('.main');
  _items = document.querySelectorAll('.main_win__item');
  _menus = document.querySelectorAll('.main__item[data-menu-index]');

  constructor() {
    this._unfold();
    this._clickItem();
    this._showMenu();
    this._adjust();
  }

  _unfold() {
    this._fold.addEventListener('click', () => {
      this._fold.classList.add('hidden'); // 先隐藏，可避免闪烁
      ipcRenderer.invoke('fold', false).then(() => {
        this._container.classList.remove('hidden');
      });
    });
  }

  _clickItem() {
    let count = 0;
    let timer = null;

    this._container.addEventListener('click', e => {
      const item = e.target.closest('.main__item');

      // 收起
      if (item.classList.contains('js-put-away')) {
        ipcRenderer.invoke('fold', true).then(() => {
          this._fold.classList.remove('hidden');
          this._container.classList.add('hidden');
        });

        return;
      }

      // 打开面板窗口
      if (item.hasAttribute('data-ipc')) {
        ipcRenderer.send(item.dataset.ipc);
        return;
      }

      // 打开设置窗口（鼠标连点5下 Logo）
      if (item.classList.contains('main__item--logo')) {
        // 1秒内连点5次触发
        if (++count === 5) ipcRenderer.send('setting');

        if (!timer) {
          timer = window.setTimeout(() => {
            count = 0;
            timer = null;
          }, 1000);
        }
      }
    });
  }

  _showMenu() {
    this._menus.forEach(menu => {
      menu.addEventListener('mouseenter', e => {
        // 隐藏菜单窗口
        ipcRenderer.send('menu', { directClose: true });

        // 显示菜单窗口
        const index = +e.target.dataset.menuIndex;
        if (index) {
          const count = index === 1 ? 5 : 3;

          ipcRenderer.send('menu', {
            index,
            width: Main._menuItemWidth * count
          });
        }
      });

      menu.addEventListener('mouseleave', () => {
        // 隐藏菜单窗口
        ipcRenderer.send('menu', { waitClose: true });
      });
    });
  }

  _adjust() {
    ipcRenderer.on('ban-adjust', () => {
      // 显示全部功能项
      this._items.forEach(item => {
        item.classList.remove('hidden');
      });

      // 隐藏禁用的功能项
      const banItems = localStorage.getItem('ban');
      const items = banItems && JSON.parse(banItems);
      if (items && items.length > 0) {
        items.forEach(menuId => {
          document.getElementById(menuId).classList.add('hidden');
        });
      }
    });
  }
}

new Main();
