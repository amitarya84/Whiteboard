import { useEffect, useState } from 'react'
import './App.css'
import ActionButtons from './components/actionButtons';
import Board from './components/board'
import Home from './components/HomePage';
import BoardProvider from './Context/boardContext';
import SocketProvider from './Context/socketProvider';

export const SHAPES = {
  SELECT: 'select',
  LINE: 'line',
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
  TEXT: 'text',
}

function App() {
  // const [drawingShape, setDrawingShape] = useState(SHAPES.LINE);
  const [clearBoard, setClearBoard] = useState(false);
  const [page, setPage] = useState('home');

  return (
    <SocketProvider>

      <BoardProvider >
        <div className="App">
          {
            (page === 'home') ?
              <>
                <Home setPage={setPage} />
              </>
              :
              <>
                {/* <ActionButtons drawingShape={drawingShape} setDrawingShape={setDrawingShape} setClearBoard={setClearBoard} /> */}
                <Board setClearBoard={setClearBoard} />
              </>
          }
        </div>
      </BoardProvider>
    </SocketProvider>
  )
}

export default App
