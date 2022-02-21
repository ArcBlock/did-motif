import React from 'react';
import Motif from './modules/motif';
import DIDMotif from './components/did-motif';

function App() {
  const did = 'zNKtCNqYWLYWYW3gWRA1vnRykfCBZYHZvzKr';
  const canvasRef = React.useRef(null);
  const canvasRef2 = React.useRef(null);

  React.useEffect(() => {
    new Motif({ did, size: 200, canvas: canvasRef.current }).render();
  }, []);

  React.useEffect(() => {
    new Motif({ did, size: 200, canvas: canvasRef2.current }).animate();
  }, []);

  const src = Motif.toDataURL({ did, size: 200 });

  return (
    <div className="App">
      <div>
        <DIDMotif did={did} />
      </div>

      <div>
        <DIDMotif did={did} animation={{ duration: 500 }} />
      </div>

      <div>
        <canvas ref={canvasRef} />
      </div>

      <div>
        <canvas ref={canvasRef2} />
      </div>

      <div>
        <img src={src} alt="" style={{ width: 44, height: 44 }} />
      </div>
    </div>
  );
}

export default App;
