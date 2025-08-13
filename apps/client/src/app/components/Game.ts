import { Tool } from "./Canvas";
import { getExistingShapes } from "./http";

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
} | {
  type: "pencil";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export class Game{
  private canvas: HTMLCanvasElement;
  private roomId: string;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private startX: number;
  private startY: number;
  private clicked = false;
  private selectedTool: Tool = "pencil";
  private token: string;

  socket: WebSocket;
  
  constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string, token: string){
    this.canvas = canvas;
    this.socket = socket;
    this.roomId = roomId;
    this.token = token;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.startX = 0;
    this.startY = 0;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  setTool(tool: "circle" | "pencil" | "rect") {
    this.selectedTool = tool;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId, this.token);
    this.clearCanvas();  
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        console.log(message);
       
        if (parsedShape && parsedShape.type) {
          this.existingShapes.push(parsedShape)
          this.clearCanvas();
        }
      }
    }
  }

  clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.map(shape => {

      if(!shape || !shape.type) return;

      if(shape.type === "rect"){
        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)

      } else if (shape.type === "circle"){
        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    })
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  }

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;
    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;

    const selectedTool = this.selectedTool;

    let shape: Shape | null = null;
    if (selectedTool === "circle"){
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;
      shape = {
        type: "circle",
        radius: radius,
        centerX: centerX,
        centerY: centerY,
      }
    } else if (selectedTool === "rect"){
        shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height
      }
      console.log(shape)
    }
    
    if(!shape){
      return;
    }

    this.existingShapes.push(shape)

    this.socket.send(JSON.stringify({
      type: "chat",
      message: JSON.stringify(shape),
      roomId: this.roomId
    }))

  }

  mouseMoveHandler = (e: MouseEvent) => {
    if (this.clicked){
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;

      this.clearCanvas();
      this.ctx.strokeStyle = 'rgb(255, 255, 255)';

      const selectedTool = this.selectedTool;

      if (selectedTool === "rect"){
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (selectedTool === "circle"){
        const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
        const centerX = this.startX + width / 2;
        const centerY = this.startY + height / 2;

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }

  initMouseHandlers(){
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
  }
}