const DEFAULT_OPTIONS = {
  width: 200,
  height: 200,
  xLines: 8,
  yLines: 8,
};

class Grid {
  constructor(options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.init();
  }

  get gapX() {
    return this.options.width / (this.options.yLines - 1);
  }

  get gapY() {
    return this.options.height / (this.options.xLines - 1);
  }

  init() {
    const { xLines, yLines } = this.options;
    // 以中心点为基准，计算每个 "点" 的偏移
    this.xOffsets = [...new Array(xLines)].map((_, x) => {
      return x * this.gapX - this.options.width / 2;
    });
    this.yOffsets = [...new Array(yLines)].map((_, y) => {
      return y * this.gapY - this.options.height / 2;
    });
  }

  getOffset(x, y) {
    return [this.xOffsets[x], this.yOffsets[y]];
  }
}

export default Grid;
