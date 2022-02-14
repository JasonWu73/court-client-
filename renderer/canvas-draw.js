require('./vendor/fabric.min');

class CanvasDraw {
  _undoEls = document.getElementById('js-undo');
  _modeEls = document.querySelectorAll('.js-mode');
  _circleEls = document.querySelectorAll('input[name="circle"]');
  _colorEls = document.querySelectorAll('input[name="color"]');

  _histories = [];

  _modes = {
    draw: 'draw',
    text: 'text',
    line: 'line',
    ellipse: 'ellipse',
    rect: 'rect',
    eraser: 'eraser'
  };
  _curMode;

  _width = 6;
  _color = '#6d1e1a';

  _canvas;

  constructor() {
    this._init();
    this._toggleModeClick();
    this._handleUndoClick();
    this._handleRadioChange();
  }

  _handleRadioChange() {
    const brush = this._canvas.freeDrawingBrush;

    this._circleEls.forEach(el => {
      el.addEventListener('change', e => {
        this._width = +e.target.dataset.value;

        this._preventAllControl();
        brush.width = this._width;
      });
    });

    this._colorEls.forEach(el => {
      el.addEventListener('change', e => {
        this._color = e.target.dataset.value;

        this._preventAllControl();
        brush.color = this._color;
      });
    });
  }

  _init() {
    this._canvas = new fabric.Canvas('js-canvas', {
      width: window.innerWidth,
      height: window.innerHeight,
      isDrawingMode: true,
      selection: false
    });

    this._canvas.freeDrawingBrush.width = this._width;
    this._canvas.freeDrawingBrush.color = this._color;

    // 记录操作历史
    this._canvas.on('object:added', () => {
      this._histories.push(JSON.stringify(this._canvas));
    });

    this._registerCanvasEvent();
  }

  _toggleModeClick() {
    this._modeEls.forEach(el => {
      el.addEventListener('click', e => {
        const tarEl = e.target.closest(
          '.screen-draw__toolbar__tools__item');
        const mode = tarEl.dataset.mode;

        if (this._curMode === mode) return;

        this._curMode = mode;

        // 重置所有
        this._resetAllMode();

        tarEl.classList.add(
          'screen-draw__toolbar__tools__item--active');

        if (mode === this._modes.draw) {
          this._canvas.isDrawingMode = true;

        } else if (mode === this._modes.eraser) {
          this._canvas.hoverCursor = 'not-allowed';

        } else if (mode === this._modes.text) {
          this._canvas.defaultCursor = 'text';
          this._canvas.hoverCursor = 'text';

        } else if (mode === this._modes.line) {
          this._canvas.defaultCursor = 'crosshair';
          this._canvas.hoverCursor = 'crosshair';

        } else if (mode === this._modes.ellipse) {
          this._canvas.defaultCursor = 'crosshair';
          this._canvas.hoverCursor = 'crosshair';

        } else if (mode === this._modes.rect) {
          this._canvas.defaultCursor = 'crosshair';
          this._canvas.hoverCursor = 'crosshair';
        }
      });
    });
  }

  _registerCanvasEvent() {
    let mouseDown;
    let line, ellipse, rect;
    let origX, origY;

    this._canvas.on('mouse:down', options => {
      const e = options.e;
      mouseDown = true;

      if (options.target && this._curMode === this._modes.eraser) {
        this._canvas.getActiveObjects().forEach(obj => {
          this._canvas.remove(obj);
        });

      } else if (this._curMode === this._modes.text) {
        const text = new fabric.IText('', {
          left: e.screenX,
          top: e.screenY,
          fill: this._color,
          fontSize: 24,
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
          hasControls: false,
          hasBorders: false
        });

        this._canvas.add(text).setActiveObject(text);
        text.enterEditing();

      } else if (this._curMode === this._modes.line) {
        const { x, y } = this._canvas.getPointer(e);
        const points = [x, y, x, y];

        line = new fabric.Line(points, {
          strokeWidth: this._width,
          fill: this._color,
          stroke: this._color,
          originX: 'center',
          originY: 'center',
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
          hasControls: false,
          hasBorders: false
        });

        this._canvas.add(line);

      } else if (this._curMode === this._modes.ellipse) {
        const { x, y } = this._canvas.getPointer(e);
        origX = x;
        origY = y;

        ellipse = new fabric.Ellipse({
          left: x,
          top: y,
          originX: 'left',
          originY: 'top',
          rx: 0,
          ry: 0,
          fill: '',
          stroke: this._color,
          strokeWidth: this._width,
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
          hasControls: false,
          hasBorders: false
        });

        this._canvas.add(ellipse);

      } else if (this._curMode === this._modes.rect) {
        const { x, y } = this._canvas.getPointer(e);
        origX = x;
        origY = y;

        rect = new fabric.Rect({
          left: x,
          top: y,
          originX: 'left',
          originY: 'top',
          width: 0,
          height: 0,
          angle: 0,
          fill: '',
          stroke: this._color,
          strokeWidth: this._width,
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
          hasControls: false,
          hasBorders: false
        });

        this._canvas.add(rect);
      }
    });

    this._canvas.on('mouse:move', options => {
      if (!mouseDown) return;

      const e = options.e;

      if (this._curMode === this._modes.line) {
        const { x, y } = this._canvas.getPointer(e);
        line.set({ x2: x, y2: y });
        this._canvas.requestRenderAll();

      } else if (this._curMode === this._modes.ellipse) {
        const { x, y } = this._canvas.getPointer(e);
        let rx = Math.abs(origX - x) / 2;
        let ry = Math.abs(origY - y) / 2;
        if (rx > ellipse.strokeWidth) {
          rx -= ellipse.strokeWidth / 2;
        }
        if (ry > ellipse.strokeWidth) {
          ry -= ellipse.strokeWidth / 2;
        }
        ellipse.set({ rx: rx, ry: ry });

        if (origX > x) {
          ellipse.set({ originX: 'right' });
        } else {
          ellipse.set({ originX: 'left' });
        }
        if (origY > y) {
          ellipse.set({ originY: 'bottom' });
        } else {
          ellipse.set({ originY: 'top' });
        }

        this._canvas.requestRenderAll();

      } else if (this._curMode === this._modes.rect) {
        const { x, y } = this._canvas.getPointer(e);

        if (origX > x) {
          rect.set({ left: Math.abs(x) });
        }
        if (origY > y) {
          rect.set({ top: Math.abs(y) });
        }

        rect.set({ width: Math.abs(origX - x) });
        rect.set({ height: Math.abs(origY - y) });

        this._canvas.requestRenderAll();
      }
    });

    this._canvas.on('mouse:up', () => {
      mouseDown = false;

      if (this._curMode === this._modes.line) {
        line.setCoords();
      } else if (this._curMode === this._modes.ellipse) {
        ellipse.setCoords();
      } else if (this._curMode === this._modes.rect) {
        rect.setCoords();
      }
    });
  }

  _resetAllMode() {
    // CSS
    this._modeEls.forEach(el => el.classList.remove(
      'screen-draw__toolbar__tools__item--active'));

    // Fabric.js
    this._canvas.isDrawingMode = false;
    this._canvas.defaultCursor = 'default';
    this._canvas.hoverCursor = 'default';

    this._preventAllControl();
  }

  _preventAllControl() {
    this._canvas.getObjects().forEach(obj => {
      // 可交互文本对象
      if (obj instanceof fabric.IText) {
        obj.exitEditing();
      }

      // 固定位置与缩放
      obj.lockMovementX = true;
      obj.lockMovementY = true;
      obj.lockScalingX = true;
      obj.lockScalingY = true;
      obj.lockRotation = true;
      obj.hasControls = obj.hasBorders = false;
    });
  }

  _handleUndoClick() {
    this._undoEls.addEventListener('click', () => {
      this._histories.pop(); // 排除当前状态

      if (this._histories.length === 0) {
        this._canvas.clear().requestRenderAll();
        return;
      }

      const state = this._histories.pop();
      this._histories = []; // 清空队列
      this._canvas.loadFromJSON(state, () => {
        this._canvas.requestRenderAll();
      });
    });
  }
}

module.exports = CanvasDraw;
