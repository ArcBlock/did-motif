import React from 'react'
import Motif from './modules/motif'
import DIDMotif from './components/did-motif'

function App() {
  const did = 'zNKtCNqYWLYWYW3gWRA1vnRykfCBZYHZvzKr'
  const canvasRef = React.useRef(null);
  const canvasRef2 = React.useRef(null);

  React.useEffect(() => {
    new Motif({ did, size: 200, canvas: canvasRef.current }).render();
  }, [])

  React.useEffect(() => {
    new Motif({ did, size: 200, canvas: canvasRef2.current }).animate();
  }, [])

  return (
    <div className="App">
      <div>
        <DIDMotif did={did} />
      </div>
      
      <div>
        <DIDMotif did={did} animation={{ duration: 500 }} />
      </div>

      <div>
        <canvas ref={canvasRef}></canvas>
      </div>

      <div>
        <canvas ref={canvasRef2}></canvas>
      </div>
    </div>
  )
}

export default App
