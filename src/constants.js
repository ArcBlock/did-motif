export const TOTAL_COLORS = 32;
export const TOTAL_POSITIONS = 64;
// 六边形半径与 did motif size 的比例
export const SHAPE_SIZE_RATIO = 0.25;
// 对于 account role type, did motif 需要被绘制为矩形, 高宽比为 0.7
export const REVERSED_ASPECT_RATIO = 0.7;
// 目前只考虑 account/application/token/asset 4 种 role type
export const RoleType = {
  ACCOUNT: 0,
  APPLICATION: 3,
  ASSET: 6,
  TOKEN: 17,
};

// did motif 整体外观的形状类型, 区别于内部绘制的六边形 (shape)
export const Shape = {
  RECTANGLE: 0,
  SQUARE: 1,
  HEXAGON: 2,
  CIRCLE: 3,
};

// renderer type
export const ElementType = {
  CANVAS: 0,
  SVG: 1,
};
