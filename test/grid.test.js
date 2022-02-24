import { expect, test } from 'vitest';
import Grid from '../src/grid';

test('Grid', () => {
  const tests = [
    [
      // 尺寸: 100x100, 3x3 网格
      { width: 100, height: 100, xLines: 3, yLines: 3 },
      {
        xOffsets: [-25, 0, 25],
        yOffsets: [-25, 0, 25],
      },
    ],
    [
      // 尺寸: 100x100, 4x4 网格
      { width: 100, height: 100, xLines: 4, yLines: 4 },
      {
        xOffsets: [-30, -10, 10, 30],
        yOffsets: [-30, -10, 10, 30],
      },
    ],
    [
      // 尺寸: 90x90, 8x8 网格
      { width: 90, height: 90, xLines: 8, yLines: 8 },
      {
        xOffsets: [-35, -25, -15, -5, 5, 15, 25, 35],
        yOffsets: [-35, -25, -15, -5, 5, 15, 25, 35],
      },
    ],
  ];
  tests.forEach(([options, expected]) => {
    const grid = new Grid(options);
    expect(grid.xOffsets).toEqual(expected.xOffsets);
    expect(grid.yOffsets).toEqual(expected.yOffsets);
  });
});
