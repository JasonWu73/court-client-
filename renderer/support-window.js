const { ipcRenderer, desktopCapturer } = require('electron');

class Main {
  _scale = window.devicePixelRatio;

  constructor() {
    this.container = document.querySelector('.support');
    this.container = document.querySelector('.support');
    this.tools = document.querySelector(
      '.support__input__tools');
    this.input = document.querySelector(
      '.support__input__content');
    this.capture = document.querySelector('.capture');
    this.submit = document.querySelector('.submit');

    this._handleImageClick();
    this._handleScreenCaptureClick();
  }

  _handleImageClick() {
    this.container.addEventListener('click', e => {
      if (e.target instanceof HTMLImageElement &&
        e.target.parentElement !== this.tools) {
        const win = window.open(e.target.src);

        // 使图片不能被拖拽
        win.eval(`
                const styles = 'img { -webkit-user-drag: none; }';

                const styleSheet = document.createElement('style');
                styleSheet.type = 'text/css';
                styleSheet.innerText = styles;
                document.head.appendChild(styleSheet);
              `);
      }
    });
  }

  _handleScreenCaptureClick() {
    this.capture.addEventListener('click', () => {
      ipcRenderer.invoke('screen-size').then(({ width, height }) => {
        desktopCapturer.getSources({
          types: ['screen'],
          thumbnailSize: {
            width: width * this._scale,
            height: height * this._scale
          }
        }).then(sources => {
          const img = document.createElement('img');
          img.src = sources[0].thumbnail.toDataURL();
          this.input.insertAdjacentElement('beforeend', img);
        });
      });
    });
  }
}

new Main();
