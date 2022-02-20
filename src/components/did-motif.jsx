import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Motif from '../modules/motif'

function DIDMotif({ did, size, animation, ...rest }) {
  const canvasRef = React.useRef(null);
  const motifRef = React.useRef(null);
  React.useEffect(() => {
    motifRef.current = new Motif({ did, size: 200, canvas: canvasRef.current });
    if (animation) {
      motifRef.current.animate(animation);
    } else {
      motifRef.current.render();
    }
  }, [])
  
  return (
    <div style={{ display: 'inline-block', width: size, height: size, overflow: 'hidden' }} {...rest}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

DIDMotif.propTypes = {
  did: PropTypes.string.isRequired,
  size: PropTypes.number,
  animation: PropTypes.object,
};

DIDMotif.defaultProps = {
  size: 200,
  animation: null,
};

export default DIDMotif;
