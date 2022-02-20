/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Grid from '../modules/grid';
import Canvas from './canvas';
import { getDIDMotifInfo } from '../modules/motif';

function DIDMotif({ did, size, grid, opacity, shapeSize, shapeCount, rounded, ...rest }) {
  const { color, positions } = useMemo(() => getDIDMotifInfo(did), [did]);
  const _grid = useMemo(() => new Grid({ width: size, height: size, xLines: grid[0], yLines: grid[1] }), [size, grid]);

  // animation
  const [progress, setProgress] = React.useState(0);
  const startTime = React.useRef(null);
  const requestRef = React.useRef();
  const animate = (time) => {
    if (startTime.current === null) {
      startTime.current = time;
    }
    const duration = 800;
    if (time - startTime.current > duration) {
      setProgress(1);
      cancelAnimationFrame(requestRef.current);
      return;
    }
    // ease-in-out
    setProgress((Math.sin(((time - startTime.current) / duration - 0.5) * Math.PI) + 1) / 2);
    requestRef.current = requestAnimationFrame(animate);
  };
  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const draw = React.useCallback(
    (ctx) => {
      // https://eperezcosano.github.io/hex-grid/#a-hexagon
      const a = (2 * Math.PI) / 6;
      const r = shapeSize;

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
      const _positions = positions;
      _positions.forEach((item) => {
        const [x, y] = _grid.getOffset(...item);
        drawHexagon(progress * x, progress * y);
      });
    },
    [did, _grid, color, positions, progress, opacity, shapeSize]
  );
  return (
    <div style={{ display: 'inline-block', width: size, height: size, overflow: 'hidden' }} {...rest}>
      <Canvas draw={draw} width={size} height={size} />
    </div>
  );
}

DIDMotif.propTypes = {
  did: PropTypes.string.isRequired,
  size: PropTypes.number,
  // 网格线数量, 决定了总的位置数, 默认 [8, 8], 水平/垂直各 8 个点位
  grid: PropTypes.array,
  // 图形透明度
  opacity: PropTypes.number,
  // TODO: [0, 1] 的小数, 相对于 size 的例
  shapeSize: PropTypes.number,
  shapeCount: PropTypes.number,
  rounded: PropTypes.bool,
};

DIDMotif.defaultProps = {
  size: 200,
  grid: [8, 8],
  opacity: 0.4,
  shapeSize: 50,
  shapeCount: 8,
  rounded: false,
};

export default DIDMotif;
