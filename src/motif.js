import multibase from 'multibase';
import Grid from './grid';
import colors from './colors';

const TOTAL_COLORS = 32;
const TOTAL_POSITIONS = 64;
// 六边形半径与 did motif size 的比例
const SHAPE_SIZE_RATIO = 0.25;
// 对于 account role type, did motif 需要被绘制为矩形, 高宽比为 0.7
const REVERSED_ASPECT_RATIO = 0.7;
// 目前只考虑 account/application/token/asset 4 种 role type
const RoleType = {
  ACCOUNT: 0,
  APPLICATION: 3,
  ASSET: 6,
  TOKEN: 17,
};

// 根据前 binary DID string 前 2 个字节获取 role type (前 6 bits)
const parseRoleType = bytes => {
  const firstByte = bytes.slice(0, 1);
  // eslint-disable-next-line no-bitwise
  return firstByte >>> 2;
};

/**
 * 解析 DID, 根据 DID 计算背景色和位置
 * @param {string} did - DID
 * @returns {object} - 返回结果包含 colorIndex (0-31) 和 positionIndexes (含 8 个元素的数组, 每个元素为 0-63 的数字)
 */
export const parseDID = did => {
  // base58 did -> binary DID string
  // 参考: https://github.com/ArcBlock/ABT-DID-Protocol#create-did (step9 -> step8)
  const decoded = multibase.decode(did);
  const roleType = parseRoleType(decoded);
  // 移除前 2 bytes (did type 部分)
  const striped = decoded.slice(2);
  // 前 8 bytes 求和后对 totalColors 取模 => colorIndex
  const colorIndex = striped.slice(0, 8).reduce((acc, cur) => acc + cur, 0) % TOTAL_COLORS;
  // 后 16 bytes 均分 8 组后每组对 2 个 bytes 求和再对 totalPositions 取模 => positionIndexes
  const trailingBytes = striped.slice(8);
  const positionIndexes = [...new Array(8)].map(
    (_, index) => (trailingBytes[index * 2] + trailingBytes[index * 2 + 1]) % TOTAL_POSITIONS
  );
  return {
    colorIndex,
    positionIndexes,
    roleType,
  };
};

// 从 DID 解析出颜色和位置
export const getDIDMotifInfo = did => {
  const { colorIndex, positionIndexes, roleType } = parseDID(did);
  return {
    color: colors[colorIndex],
    // 每个 positionIndex 是一个 [x, y] 的序号, 将其转换为一个 8x8 网格的坐标, 比如 0 -> [0, 0], 4 -> [0, 4], 8 -> [1, 0]
    positions: positionIndexes.map(index => [Math.floor(index / 8), index % 8]),
    roleType,
  };
};

export class DIDMotif {
  static toDataURL({ did, size = 120 }) {
    return new DIDMotif({ did, size, canvas: document.createElement('canvas') })
      .render()
      .toDataURL();
  }

  constructor({ did, size = 120, opacity = 0.5, canvas }) {
    if (!did) {
      throw new Error('DID is required');
    }
    this.size = size;
    this.did = did;
    if (canvas) {
      canvas.width = size;
      canvas.height = size;
      this.canvas = canvas;
    }
    this.opacity = opacity;
    this.shapeSize = size * SHAPE_SIZE_RATIO;
    const { color, positions, roleType } = getDIDMotifInfo(did);
    // 背景色
    this.color = color;
    // 位置
    const grid = new Grid({ width: size, height: size, xLines: 8, yLines: 8 });
    this.positions = positions.map(item => grid.getOffset(item[0], item[1]));
    this.roleType = roleType;
  }

  draw(canvas, positions) {
    const { size, color, shapeSize: r, opacity } = this;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, size, size);

    // 根据 role type 进行 clip 处理
    switch (this.roleType) {
      case RoleType.ACCOUNT: {
        roundRect(
          ctx,
          0,
          (size * (1 - REVERSED_ASPECT_RATIO)) / 2,
          size,
          size * REVERSED_ASPECT_RATIO,
          10,
          false,
          false
        );
        break;
      }
      case RoleType.ASSET: {
        // ctx.arc(100, 100, 75, 0, Math.PI * 2, false);
        drawHexagon(ctx, size / 2, size / 2, size / 2, 0);
        break;
      }
      case RoleType.TOKEN: {
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        break;
      }
      case RoleType.APPLICATION:
      default: {
        roundRect(ctx, 0, 0, size, size, 10, false, false);
      }
    }
    ctx.clip();

    // 背景色
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);

    // 六边形绘制
    ctx.save();
    ctx.translate(size / 2, size / 2);
    positions.forEach(([x, y]) => drawHexagon(ctx, x, y, r, opacity));
    ctx.restore();
    return canvas;
  }

  render() {
    return this.draw(this.canvas, this.positions);
  }

  animate(options = {}) {
    const { duration = 1000, onComplete = () => {} } = options;
    let startTime = null;
    let progress = 0;
    let raf = null;
    const cancel = () => {
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
    const update = t => {
      if (!startTime) {
        startTime = t;
      }
      if (t - startTime > duration) {
        progress = 1;
        onComplete();
      } else {
        progress = easeOutBack((t - startTime) / duration);
        raf = requestAnimationFrame(update);
      }
      this.draw(
        this.canvas,
        this.positions.map(item => [progress * item[0], progress * item[1]])
      );
    };
    requestAnimationFrame(update);
    return cancel;
  }
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
function roundRect(ctx, x, y, width, height, radius = 10, fill, stroke = true) {
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

// https://eperezcosano.github.io/hex-grid/#a-hexagon
function drawHexagon(ctx, x, y, r, opacity) {
  const a = (2 * Math.PI) / 6;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.lineTo(x + r * Math.cos(a * (i - 1.5)), y + r * Math.sin(a * (i - 1.5)));
  }
  ctx.closePath();
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.fill();
}

// https://github.com/AndrewRayCode/easing-utils/blob/master/src/easing.js
function easeOutBack(t, magnitude = 1.70158) {
  const scaledTime = t / 1 - 1;
  return scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude) + 1;
}
