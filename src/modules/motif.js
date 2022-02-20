import multibase from 'multibase';
import Grid from './grid';
import colors from './colors';

/**
 * 解析 DID, 根据 DID 计算背景色和位置
 * @param {string} did - DID
 * @param {number} totalColors - 颜色总数 (32)
 * @param {number} totalPositions - 位置总数 (8x8=64)
 * @returns {object} - 返回结果包含 colorIndex (0-31) 和 positionIndexes (含 8 个元素的数组, 每个元素为 0-63 的数字)
 */
export const parseDID = (did, totalColors = 32, totalPositions = 64) => {
  // base58 did -> binary DID string
  // 参考: https://github.com/ArcBlock/ABT-DID-Protocol#create-did (step9 -> step8)
  const decoded = multibase.decode(did);
  // 移除前 2 bytes (did type 部分)
  const striped = decoded.slice(2);
  // 前 8 bytes 求和后对 totalColors 取模 => colorIndex
  const colorIndex = striped.slice(0, 8).reduce((acc, cur) => acc + cur, 0) % totalColors;
  // 后 16 bytes 均分 8 组后每组对 2 个 bytes 求和再对 totalPositions 取模 => positionIndexes
  const trailingBytes = striped.slice(8);
  const positionIndexes = [...new Array(8)].map(
    (_, index) => (trailingBytes[index * 2] + trailingBytes[index * 2 + 1]) % totalPositions
  );

  return {
    colorIndex,
    positionIndexes,
    // TODO
    // type: ''
  };
};

// 从 DID 解析出颜色和位置
export const getDIDMotifInfo = (did) => {
  const { colorIndex, positionIndexes } = parseDID(did);
  return {
    color: colors[colorIndex],
    // 每个 positionIndex 是一个 [x, y] 的序号, 将其转换为一个 8x8 网格的坐标, 比如 0 -> [0, 0], 4 -> [0, 4], 8 -> [1, 0]
    positions: positionIndexes.map((index) => [Math.floor(index / 8), index % 8]),
  };
};

// 0 - 63 ==>
// [0,0] [0,1] [0,2] [0,3] [0,4] [0,5] [0,6] [0,7]
// [1,0] [1,1] [1,2] [1,3] [1,4] [1,5] [1,6] [1,7]
// ...
// [7,0] [7,1] [7,2] [7,3] [7,4] [7,5] [7,6] [7,7]


// 渲染 did motif
export const render = (canvas, options) => {
  const { did, size = 120, animation } = options;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  const opacity = 0.5;
  // TODO: 图形和 canvas 的比例问题
  const shapeSize = size * 0.25;
  const { color, positions } = getDIDMotifInfo(did);
  const grid = new Grid({ width: size, height: size, xLines: 8, yLines: 8 });
  const offsets = positions.map(item => grid.getOffset(item[0], item[1]));

  const draw = (ctx, { size, r, color, positions }) => {
    // https://eperezcosano.github.io/hex-grid/#a-hexagon
    const a = (2 * Math.PI) / 6;
    function drawHexagon(x, y) {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + r * Math.cos(a * (i - 1.5)), y + r * Math.sin(a * (i - 1.5)));
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
      ctx.restore();
    }

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
    positions.forEach((position) => drawHexagon(position[0], position[1]));
  }

  if (animation && animation.duration) {
    const { duration, onComplete } = animation;
    let startTime = null;
    let progress = 0;
    let raf = null;
    const update = (t) => {
      startTime || (startTime = t);
      if (t - startTime > duration) {
        progress = 1;
        onComplete && onComplete();
      } else {
        progress = easeOutBack((t - startTime) / duration);
        raf = requestAnimationFrame(update);
      }
      draw(context, { size, r: shapeSize, color, positions: offsets.map(item => [progress * item[0], progress * item[1]]) })
    };
    requestAnimationFrame(update);
    return canvas;
  }
  draw(context, { size, r: shapeSize, color, positions: offsets })
  return canvas;
}

// https://github.com/AndrewRayCode/easing-utils/blob/master/src/easing.js
export function easeOutBack(t, magnitude = 1.70158) {
  const scaledTime = t / 1 - 1;
  return scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude) + 1;
}
