import { animate, calcBorderRadius, genUniqueID } from '../utils';
import { REVERSED_ASPECT_RATIO, Shape, SHAPE_SIZE_RATIO } from '../constants';
import Grid from '../grid';

const XMLNS = 'http://www.w3.org/2000/svg';

// 小数处理, 例: 71.65063509461098 => 71.7
function svgValue(value) {
  return Math.round(value * 10) / 10;
}

export default class SvgRenderer {
  constructor(el, config) {
    this.el = el;
    this.config = config;

    const _size =
      config.size ||
      Math.min(Number(el.getAttribute('width')) || 100, Number(el.getAttribute('height')) || 100);

    el.setAttribute('viewBox', `0 0 ${_size} ${_size}`);

    const grid = new Grid({ width: _size, height: _size, xLines: 8, yLines: 8 });
    this.config = {
      ...config,
      size: _size,
      positions: config.positions.map(item => {
        const [x, y] = grid.getOffset(item[0], item[1]);
        return [svgValue(x), svgValue(y)];
      }),
      shapeSize: svgValue(_size * SHAPE_SIZE_RATIO),
    };

    this.points = this.calcPoints(_size / 2, _size / 2, this.config.shapeSize);
  }

  // background & clip
  setBackground() {
    const { size, color, shape } = this.config;
    const borderRadius = calcBorderRadius(size);
    // clip
    let clipElement;
    switch (shape) {
      case Shape.RECTANGLE: {
        clipElement = this.drawRoundedRect(
          0,
          svgValue((size * (1 - REVERSED_ASPECT_RATIO)) / 2),
          size,
          svgValue(size * REVERSED_ASPECT_RATIO),
          borderRadius
        );
        break;
      }
      case Shape.HEXAGON: {
        const points = this.calcPoints(size / 2, size / 2, size / 2);
        clipElement = this.drawHexagon(points);
        break;
      }
      case Shape.CIRCLE: {
        clipElement = this.createElement('circle', { cx: size / 2, cy: size / 2, r: size / 2 });
        break;
      }
      case Shape.SQUARE:
      default: {
        clipElement = this.drawRoundedRect(0, 0, size, size, borderRadius);
      }
    }

    const clipPathID = genUniqueID('clip-path');
    const clipPath = this.createElement('clipPath', { id: clipPathID }, [clipElement]);
    this.el.appendChild(this.createElement('defs', {}, [clipPath]));

    const g = this.createElement(
      'g',
      { 'clip-path': `url(#${clipPathID})` },
      this.createElement('rect', { x: 0, y: 0, width: size, height: size, fill: color })
    );
    this.g = g;
    this.el.appendChild(g);
  }

  render() {
    this.el.innerHTML = '';
    this.setBackground();
    this.drawHexagons(this.config.positions);
  }

  drawHexagons(positions) {
    const { opacity } = this.config;
    if (!this.hexagons) {
      this.hexagons = positions.map(() => {
        const hexagon = this.drawHexagon(this.points, opacity);
        this.g.appendChild(hexagon);
        return hexagon;
      });
    }
    this.hexagons.forEach((hexagon, index) => {
      hexagon.setAttribute('transform', `translate(${positions[index][0]} ${positions[index][1]})`);
    });
  }

  animate(options = {}) {
    const { duration = 1000, onComplete = () => {} } = options;
    const { positions } = this.config;
    this.setBackground();
    return animate({
      duration,
      onComplete,
      callback: progress => {
        this.drawHexagons(positions.map(item => [progress * item[0], progress * item[1]]));
      },
    });
  }

  // 以中心点为基准, 获取六边形的 6 个顶点
  calcPoints(x, y, r) {
    const a = (2 * Math.PI) / 6;
    const points = [];
    for (let i = 0; i < 6; i++) {
      points.push([x + r * Math.cos(a * (i - 1.5)), y + r * Math.sin(a * (i - 1.5))]);
    }
    return points.map(point => [svgValue(point[0]), svgValue(point[1])]);
  }

  getPointsStr(points) {
    return points.map(point => `${svgValue(point[0])},${svgValue(point[1])}`).join(' ');
  }

  drawHexagon(points, opacity) {
    const hexagon = this.createElement('polygon', {
      points: this.getPointsStr(points),
      transformOrigin: 'center',
      // transform: `translate(${svgValue(x)} ${svgValue(y)})`,
      style: {
        fill: '#fff',
        fillOpacity: opacity,
      },
    });
    return hexagon;
  }

  drawRoundedRect(x, y, width, height, radius = 10, fill = 'none') {
    return this.createElement('rect', { x, y, width, height, rx: radius, ry: radius, fill });
  }

  createElement(name, attrs = {}, children = []) {
    const el = document.createElementNS(XMLNS, name);
    const { style = {}, ...rest } = attrs;
    Object.keys(rest).forEach(key => {
      el.setAttribute(key, rest[key]);
    });
    Object.keys(style).forEach(key => {
      el.style[key] = style[key];
    });
    if (!Array.isArray(children)) {
      // eslint-disable-next-line no-param-reassign
      children = [children];
    }
    children.forEach(child => el.appendChild(child));
    return el;
  }
}
