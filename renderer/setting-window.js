const { ipcRenderer } = require('electron');

class Main {
  _nav = document.querySelector('.setting__nav');
  _tabs = document.querySelectorAll('.setting__nav__item');
  _panels = document.querySelectorAll('.setting__content > section');
  _switches = document.querySelectorAll('.switch input');
  _matrixTab = document.getElementById('js-matrix-tab');
  _matrices = document.querySelectorAll(
    '.setting__content__matrix__container');
  _matrixDel = document.getElementById('js-matrix-del');
  _matrixSaveAs = document.getElementById('js-matrix-save-as');

  constructor() {
    this._clickNav();
    this._initBan();
    this._saveBan();
    this._clickMatrixTab();
    this._sortMatrix();
  }

  _clickNav() {
    this._nav.addEventListener('click', e => {
      const target = e.target.closest('.setting__nav__item');
      const panel = document.getElementById(
        `js-panel-${target.dataset.panel}`);

      this._tabs.forEach(
        tab => tab.classList.remove('setting__nav__item--active'));
      this._panels.forEach(panel => this._hide(panel));

      target.classList.add('setting__nav__item--active');
      panel.classList.remove('hidden');
    });
  }

  _initBan() {
    const banItems = localStorage.getItem('ban');
    const items = banItems && JSON.parse(banItems);
    if (items && items.length > 0) {
      items.forEach(menuId => {
        document.getElementById(menuId).checked = false;
      });
    }
  }

  _saveBan() {
    window.onbeforeunload = () => {
      const items = [];

      this._switches.forEach(switchItem => {
        if (!switchItem.checked) {
          items.push(switchItem.id);
        }
      });

      const banItems = JSON.stringify(items);
      localStorage.setItem('ban', banItems);

      ipcRenderer.send('bounds-adjust', banItems);
    };
  }

  _clickMatrixTab() {
    this._matrixTab.addEventListener('click', e => {
      const index = +e.target.dataset.index;

      const matrix = document.getElementById(`js-matrix-${index}`);

      if (!matrix) return;

      // 隐藏其他
      this._matrices.forEach(el => this._hide(el));
      this._hide(this._matrixDel);
      this._hide(this._matrixSaveAs);

      matrix.classList.remove('hidden');

      // 这里只是为了看效果，肯定要改的
      if (index === 1) return;

      this._matrixDel.classList.remove('hidden');
      this._matrixSaveAs.classList.remove('hidden');
    });
  }

  _sortMatrix() {
    const handleDragover = element => {
      element.addEventListener('dragover', e => {
        e.preventDefault();
      });
    };

    const handleDrop = element => {
      element.addEventListener('drop', e => {
        e.preventDefault();

        const original = document.getElementById(
          e.dataTransfer.getData('id'));
        const originalParent = original.parentElement;
        const destination = e.currentTarget.firstElementChild;

        e.currentTarget.replaceChild(original, destination);
        originalParent.appendChild(destination);
      });
    };

    const handleDragstart = element => {
      element.addEventListener('dragstart', e => {
        e.dataTransfer.setData('id', e.target.id);
      });
    };

    const nav1 = document.getElementById('js-nav-matrix-2');
    const nav2 = document.getElementById('js-nav-matrix-3');

    handleDragover(nav1.parentElement);
    handleDragover(nav2.parentElement);

    handleDrop(nav1.parentElement);
    handleDrop(nav2.parentElement);

    handleDragstart(nav1);
    handleDragstart(nav2);
  }

  _hide(el) {
    if (el.classList.contains('hidden')) return;

    el.classList.add('hidden');
  }
}

new Main();
