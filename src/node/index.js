import { createCanvas } from '@napi-rs/canvas';
import { getConfiguration } from '../motif';
import CanvasRenderer from '../renderer/canvas-renderer';

export { Shape } from '../constants';

const render = (did, config = {}) => {
  const _config = { ...getConfiguration(did, config), size: config.size || 100 };
  const canvas = createCanvas(_config.size, _config.size);
  new CanvasRenderer(canvas.getContext('2d'), _config).render();
  return canvas;
};

export const toDataURL = (did, config = {}) => {
  const canvas = render(did, config);
  return canvas.toDataURL();
};

export const toPng = (did, config = {}) => {
  const canvas = render(did, config);
  return canvas.toBuffer('image/png');
};
