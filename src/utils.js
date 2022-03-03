import { ElementType } from './constants';

// https://github.com/AndrewRayCode/easing-utils/blob/master/src/easing.js
export const easeOutBack = (t, magnitude = 1.70158) => {
  const scaledTime = t / 1 - 1;
  return scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude) + 1;
};

// Refer to https://www.notion.so/arcblock/DID-Hash-f46254499c954ef399d84f371fcfecc1#fb17d0052a1b457dbde8ba6abd28e87b
export const calcBorderRadius = size => {
  return size > 80 ? 10 : Math.floor(0.1 * size + 2);
};

export const getElementType = el => {
  if (el) {
    const { tagName } = el;
    if (/^svg$/i.test(tagName)) {
      return ElementType.SVG;
    }
    if (/^canvas$/i.test(tagName) && 'getContext' in el) {
      return ElementType.CANVAS;
    }
  }
  throw new Error(`Expected a svg or canvas element, got ${el}`);
};

export const animate = (options = {}) => {
  const { callback, duration = 1000, onComplete = () => {}, ease = easeOutBack } = options;
  let startTime = null;
  let progress = 0;
  let raf = null;
  const cancel = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  };
  const update = t => {
    if (!startTime) {
      startTime = t;
    }
    if (t - startTime >= duration) {
      progress = 1;
      onComplete();
    } else {
      progress = ease((t - startTime) / duration);
      raf = requestAnimationFrame(update);
    }
    callback(progress);
  };
  requestAnimationFrame(update);
  return cancel;
};

export const genUniqueID = (prefix = '') => {
  return `${prefix}_${Math.floor(Math.random() * 10000)}_${Date.now()}`;
};
