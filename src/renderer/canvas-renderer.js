import { animate, calcBorderRadius } from '../utils';
import { REVERSED_ASPECT_RATIO, Shape, SHAPE_SIZE_RATIO } from '../constants';
import Grid from '../grid';

export default class CanvasRenderer {
  constructor(ctx, config) {
    this.ctx = ctx;
    const _size = config.size || Math.min(ctx.canvas.width, ctx.canvas.height) || 100;
    ctx.canvas.width = _size;
    ctx.canvas.height = _size;
    const grid = new Grid({ width: _size, height: _size, xLines: 8, yLines: 8 });
    this.config = {
      ...config,
      size: _size,
      positions: config.positions.map((item) => grid.getOffset(item[0], item[1])),
      shapeSize: _size * SHAPE_SIZE_RATIO,
    };
  }

  render() {
    this.draw(this.config.positions);
  }

  draw(positions) {
    const { ctx } = this;
    const { size, color, shapeSize: r, opacity, shape } = this.config;
    const borderRadius = calcBorderRadius(size);

    ctx.clearRect(0, 0, size, size);

    // 根据 role type 进行 clip 处理
    switch (shape) {
      case Shape.RECTANGLE: {
        this.drawRoundedRect(
          ctx,
          0,
          (size * (1 - REVERSED_ASPECT_RATIO)) / 2,
          size,
          size * REVERSED_ASPECT_RATIO,
          borderRadius,
          false,
          false
        );
        break;
      }
      case Shape.HEXAGON: {
        this.drawHexagon(ctx, size / 2, size / 2, size / 2, 0);
        break;
      }
      case Shape.CIRCLE: {
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        break;
      }
      case Shape.SQUARE:
      default: {
        this.drawRoundedRect(ctx, 0, 0, size, size, borderRadius, false, false);
      }
    }
    ctx.clip();

    // 背景色
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);

    // 六边形绘制
    ctx.save();
    ctx.translate(size / 2, size / 2);
    positions.forEach(([x, y]) => this.drawHexagon(ctx, x, y, r, opacity));
    ctx.restore();
  }

  animate(options = {}) {
    const { duration = 1000, onComplete = () => {} } = options;
    const { positions } = this.config;
    return animate({
      duration,
      onComplete,
      callback: (progress) => {
        this.draw(positions.map((item) => [progress * item[0], progress * item[1]]));
      },
    });
  }

  // https://eperezcosano.github.io/hex-grid/#a-hexagon
  drawHexagon(ctx, x, y, r, opacity) {
    const a = (2 * Math.PI) / 6;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(x + r * Math.cos(a * (i - 1.5)), y + r * Math.sin(a * (i - 1.5)));
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fill();
  }

  /**
   * Draws a rounded rectangle using the current state of the canvas.
   * If you omit the last three params, it will draw a rectangle
   * outline with a 5 pixel border radius
   * Refer to https://stackoverflow.com/a/3368118
   * @param {CanvasRenderingContext2D} ctx
   * @param {Number} x The top left x coordinate
   * @param {Number} y The top left y coordinate
   * @param {Number} width The width of the rectangle
   * @param {Number} height The height of the rectangle
   * @param {Number} [radius = 5] The corner radius; It can also be an object
   *                 to specify different radii for corners
   * @param {Number} [radius.tl = 0] Top left
   * @param {Number} [radius.tr = 0] Top right
   * @param {Number} [radius.br = 0] Bottom right
   * @param {Number} [radius.bl = 0] Bottom left
   * @param {Boolean} [fill = false] Whether to fill the rectangle.
   * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
   */
  drawRoundedRect(ctx, x, y, width, height, radius = 10, fill = false, stroke = true) {
    const _radius =
      typeof radius === 'number'
        ? { tl: radius, tr: radius, br: radius, bl: radius }
        : { tl: 0, tr: 0, br: 0, bl: 0, ...radius };
    ctx.beginPath();
    ctx.moveTo(x + _radius.tl, y);
    ctx.lineTo(x + width - _radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + _radius.tr);
    ctx.lineTo(x + width, y + height - _radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - _radius.br, y + height);
    ctx.lineTo(x + _radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - _radius.bl);
    ctx.lineTo(x, y + _radius.tl);
    ctx.quadraticCurveTo(x, y, x + _radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }
}
