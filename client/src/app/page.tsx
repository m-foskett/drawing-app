"use client"

import { useEffect, useState } from 'react';
import { useDraw } from '../../hooks/useDraw'
import { ChromePicker } from 'react-color'
import { io } from "socket.io-client"
import { drawLine } from '../../utils/drawLine';
import NextImage from 'next/image' ;

const socket = io('http://localhost:3001'); // change to hosted domain

export default function Home() {
  // State Variables
  const [colour, setColour] = useState<string>('#000')
  // Custom Hook: useDraw(drawLine)
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);

  useEffect(() => {
    const canvasContext = canvasRef.current?.getContext('2d');
    // Let server know that a new client instance is ready to receive the canvas state
    socket.emit('client-ready');
    // Listen to the 'get-canvas-state' from server
    socket.on('get-canvas-state', () => {
      // Guard Clause
      if(!canvasRef.current?.toDataURL()) return;
      // Emit the canvas state to server
      socket.emit('canvas-state', canvasRef.current.toDataURL());
    })
    // Listen to the 'canvas-state-from-server' event from server
    socket.on('canvas-state-from-server', (state: string) => {
      const img = new Image();
      img.src = state;
      // Draw the received canvas state on the new client instance's canvas
      img.onload = () => {
        canvasContext?.drawImage(img, 0, 0);
      }
    })
    // Listen to the 'draw-line' event from server
    socket.on('draw-line', ({prevPoint, currentPoint, colour}: DrawLineProps) => {
      // Guard Clause
      if(!canvasContext) return;
      // Call the drawLine function after receiving event from server
      drawLine({prevPoint, currentPoint, canvasContext, colour})
    })
    // Listen to the clear event
    socket.on('clear', clear)

    return () => {
      socket.off('get-canvas-state');
      socket.off('canvas-state-from-server');
      socket.off('draw-line');
      socket.off('clear');
    }
  }, [canvasRef, clear])

  // Function: createLine({canvasContext, currentPoint, prevPoint}: Draw)
  // Wraps the drawLine utility function and also emits draw-line event to the server
  function createLine({canvasContext, currentPoint, prevPoint }: Draw) {
    // Emit draw-line event to server
    socket.emit('draw-line', ({prevPoint, currentPoint, colour}));
    drawLine({prevPoint, currentPoint, canvasContext, colour})
  }

  return (
    // Root Container
    <div className=' flex flex-row w-screen h-screen bg-skyblue justify-around items-center overflow-hidden' >
      {/* Interactables */}
      <div className='flex flex-col gap-10 px-5 sm:px-10 items-center'>
        {/* Colour Picker */}
        <ChromePicker color={colour} onChange={(e) => setColour(e.hex)} className=''/>
        {/* Clear Canvas Button */}
        <button type='button' onClick={() => socket.emit('clear')} className="w-[75%] h-[75%]">
          <NextImage src={require("../app/assets/clearCanvas.png")} alt=""/>
        </button>
      </div>
      {/* Canvas */}
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={750}
        height={750}
        className='bg-white border border-black mr-10 rounded-md flex-shrink min-w-0 min-h-0 overflow-hidden'
      />
    </div>
  )
}
