import axios from "axios";
import { HTTP_BACKEND } from "../config";

type Shape = {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
} | {
  type: "circle";
  centerX: number;
  centerY: number;
  radius: number;
}

export const initDraw = async (canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) => {
  let existingShapes: Shape[] = await getExistingShapes(roomId)
  const ctx = canvas.getContext("2d");

  if(!ctx){
    return;
  }

  clearCanvas(ctx, canvas, existingShapes)
  
  socket.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    
    if (parsedData.type === "chat"){
      const parsedShape = JSON.parse(parsedData.message);
      existingShapes.push(parsedShape);
      clearCanvas(ctx, canvas, existingShapes);
    }
  } 
  
  clearCanvas(ctx, canvas, existingShapes)

  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX
    startY = e.clientY
  })

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX
    const height = e.clientY - startY
    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height
    }
    existingShapes.push(shape)
    socket.send(JSON.stringify({
      type: "chat",
      message: JSON.stringify(shape),
      roomId
    }))
  })

  canvas.addEventListener("mousemove", (e) => {
    if(clicked){
      const width = e.clientX - startX
      const height = e.clientY - startY
      clearCanvas(ctx, canvas, existingShapes);
      ctx.strokeStyle = "rgba(255, 255, 255)"
      ctx.strokeRect(startX, startY, width, height);

    }
  })
}

const clearCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, existingShapes: Shape[]) => {
  ctx.clearRect(0, 0, canvas.height, canvas.width);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map(shape => {
    if(shape.type === "rect"){
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
    }
  })
}

const getExistingShapes = async (roomId: string) => {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`, {
    headers: {
      "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OWM3ZTIxYS1lZDBmLTQ2MzYtYWQ1MS1mNWExMjAxYTNlNTkiLCJpYXQiOjE3NTM4MDkwMDl9.r5vbBYzOhqCfBOK43bezVRUPo9N_FdnXxgsGDTZmPWg"
    }
  });
  const messages = res.data.messages;

  const shapes = messages.map((x: {message: string}) => {
    const messageData = JSON.parse(x.message)
    return messageData;
  })

  return shapes;
}