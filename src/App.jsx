import React from 'react'
import { render } from './modules/motif'
import DIDMotif from './components/did-motif'

function App() {
  const did = 'zNKtCNqYWLYWYW3gWRA1vnRykfCBZYHZvzKr'
  const canvasRef = React.useRef(null);
  const canvasRef2 = React.useRef(null);

  React.useEffect(() => {
    render(canvasRef.current, { did, size: 200 })
  }, [canvasRef])

  React.useEffect(() => {
    const canvas = render(canvasRef2.current, { did, size: 200, animation: { duration: 800 } })
  }, [canvasRef2])

  return (
    <div className="App">
      <DIDMotif did={did} />

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
