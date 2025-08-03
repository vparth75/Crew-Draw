"use client"

import { useEffect, useRef, useState } from "react";
import { initDraw } from "../draw";
import { WS_URL } from "../config";

export function Canvas({ roomId }: { roomId: string }){
  const canvasRef = useRef<HTMLCanvasElement>(null); 
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OWM3ZTIxYS1lZDBmLTQ2MzYtYWQ1MS1mNWExMjAxYTNlNTkiLCJpYXQiOjE3NTM4MDkwMDl9.r5vbBYzOhqCfBOK43bezVRUPo9N_FdnXxgsGDTZmPWg`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({
        type: "join_room",
        roomId
      }))
    }

    return () => {
      ws.close();
    }

  }, [roomId]);

  useEffect(() => {
    console.log(canvasRef.current)
    if(socket && canvasRef.current){
      initDraw(canvasRef.current, roomId, socket);
    }
  }, [socket, roomId])

  if(!socket){
    return <div>
      Connecting to server...
    </div>
  }

  return <div className="">
    <canvas width={2000} height={2000} ref={canvasRef}></canvas>
    hi there
  </div>
}