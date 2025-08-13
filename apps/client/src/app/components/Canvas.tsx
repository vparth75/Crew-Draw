"use client"
import { useEffect, useRef, useState } from "react";
import { WS_URL } from "../config";
import IconButton from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "./Game";

export type Tool = 'pencil' | 'rect' | 'circle';

export function Canvas({ roomId, token }: {
  roomId: string,
  token: string
}){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("pencil");

  const [game, setGame] = useState<Game>();

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=${token}`);

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
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if(socket && canvasRef.current){
      const g = new Game(canvasRef.current, socket, roomId, token);
      setGame(g);
    }
  }, [socket, roomId]);

  if(!socket){
    return <div>
      Connecting to server...
    </div>
  }

  return <div className="relative">
    <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool}></TopBar>
    <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef}></canvas>
  </div>
}

function TopBar({
  selectedTool,
  setSelectedTool
}: {
  selectedTool: Tool,
  setSelectedTool: (s: Tool) => void
}){
  return <div className="absolute text-white flex z-10 bg-neutral-800 rounded m-4">
    <IconButton 
      icon={<Pencil />}
      onClick={() => {setSelectedTool("pencil")}}
      activated = {selectedTool === "pencil"}
    ></IconButton>

    <IconButton 
      icon={<RectangleHorizontalIcon />}
      onClick={() => {setSelectedTool("rect")}}
      activated = {selectedTool === "rect"}
    ></IconButton>

    <IconButton 
      icon={<Circle />}
      onClick={() => {setSelectedTool("circle")}}
      activated = {selectedTool === "circle"}
    ></IconButton>

  </div>
}