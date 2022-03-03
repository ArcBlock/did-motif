import multibase from 'multibase';
import colors from './colors';
import { getElementType } from './utils';
import CanvasRenderer from './renderer/canvas-renderer';
import SvgRenderer from './renderer/svg-renderer';
import { TOTAL_COLORS, TOTAL_POSITIONS, Shape, RoleType, ElementType } from './constants';

class DIDParsingError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'DIDParsingError';
  }
}

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
  try {
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
  } catch (e) {
    throw new DIDParsingError(`Failed to parse DID, ${did}`, { cause: e });
  }
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

// 优先使用显式传入的 shape, 如果未传入或传入值无效, 则使用根据 roleType 推断出的 shape, 默认使用 Shape.SQUARE
const getMotifShapeType = (shape, roleType) => {
  if (Object.values(Shape).indexOf(shape) > -1) {
    return shape;
  }
  const roleTypeShapeMapping = {
    [RoleType.ACCOUNT]: Shape.RECTANGLE,
    [RoleType.APPLICATION]: Shape.SQUARE,
    [RoleType.ASSET]: Shape.HEXAGON,
    [RoleType.TOKEN]: Shape.CIRCLE,
  };
  const result = roleTypeShapeMapping[roleType];
  return !result && result !== 0 ? Shape.SQUARE : result;
};

const getConfiguration = (did, config) => {
  const { opacity = 0.5, shape, ...rest } = config;
  const { color, positions, roleType } = getDIDMotifInfo(did);
  return {
    color,
    positions,
    opacity,
    shape: getMotifShapeType(shape, roleType),
    ...rest,
  };
};

// 将 canvas 或 svg 元素更新/渲染为 did motif
export const update = (element, did, config = {}) => {
  try {
    const _config = getConfiguration(did, config);
    const elementType = getElementType(element);
    const renderer =
      elementType === ElementType.CANVAS
        ? new CanvasRenderer(element.getContext('2d'), _config)
        : new SvgRenderer(element, _config);

    const { animation } = config;
    if (animation) {
      renderer.animate(typeof animation === 'object' ? animation : {});
    } else {
      renderer.render();
    }
  } catch (e) {
    // 对于 DID 解析失败的情况, 只打印错误信息 (此时不会执行渲染逻辑)
    if (e instanceof DIDParsingError) {
      // eslint-disable-next-line no-console
      console.log(e.message);
    } else {
      throw e;
    }
  }
};

export const toDataURL = (did, config) => {
  const _config = getConfiguration(did, config);
  const canvas = document.createElement('canvas');
  new CanvasRenderer(canvas.getContext('2d'), _config).render();
  return canvas.toDataURL();
};
