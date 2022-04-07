import { getConfiguration } from '../motif';
import SvgRenderer from '../renderer/svg-renderer';
import Element from './element';

export { Shape } from '../constants';

export const toSvg = (did, config = {}) => {
  const _config = { ...getConfiguration(did, config), size: config.size || 100 };
  const el = new Element('svg', { xmlns: 'http://www.w3.org/2000/svg' });
  const renderer = new _SvgRenderer(el, _config);
  renderer.render();
  return el.toString();
};

// 基于 svg content 的 toDataURL
export const toDataURL = (did, config = {}) => {
  const svgContent = toSvg(did, config);
  const prefix = 'data:image/svg+xml;base64,';
  return prefix + Buffer.from(svgContent).toString('base64');
};

class _SvgRenderer extends SvgRenderer {
  // 覆盖 createElement 方法
  createElement(...args) {
    return new Element(...args);
  }
}
