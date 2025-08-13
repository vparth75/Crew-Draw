import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users = new Map<WebSocket, User>();

const JWT_SECRET = process.env.JWT_SECRET;

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);

    if (typeof decoded === "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (e) {
    return null;
  }
}

async function checkRoom({ roomId, ws }: { roomId: string, ws: WebSocket}){
  try{
    const roomExists = await prismaClient.room.findUnique({
      where: {
        id: roomId
      }
    })
    if(!roomExists){
      ws.send(JSON.stringify({
        message: "Room does not exist"
      }))
      return;
    }
  } catch(e){
    console.error('error checking room', e);
  }
}

wss.on("connection", function connection(ws, req) {
  const url = req.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  users.set(ws, {
    userId,
    rooms: [],
    ws,
  });

  ws.send(
    JSON.stringify({
      message: "Connected",
    })
  );

  ws.on("message", async function message(data) {
    let parsedData;

    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
    }

    try{
      checkRoom({ roomId: parsedData.roomId, ws })

      if (parsedData.type === "join_room") {
        const user = users.get(ws);
        if (!user) {
          console.error("User not connected");
          return;
        }

        user.rooms.push(parsedData.roomId);
        ws.send(
          JSON.stringify({
            message: "Joined room",
          })
        );
      }
    } catch(e) {
      ws.send('Error joining the room')
    }

    try{
      checkRoom({ roomId: parsedData.roomId, ws })

      if (parsedData.type === "leave_room") {
        const user = users.get(ws);
        if (!user) {
          return;
        }

        user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
        ws.send(
          JSON.stringify({
            message: "Left room",
          })
        );
      }
    } catch(e){
      ws.send('Error leaving the room')
    }

    try{
      checkRoom({ roomId: parsedData.roomId, ws })

      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        const user = users.get(ws);

        if (!user) {
          ws.send(
            JSON.stringify({
              message: "User not found",
            })
          );
          return;
        }

        if (!user.rooms.includes(roomId)) {
          ws.send(
            JSON.stringify({
              message: "You must join the room before sending messages",
            })
          );
          return;
        }

        try {
          await prismaClient.chat.create({
            data: {
              roomId,
              message,
              userId,
              senderId: user.userId,
            },
          });

          users.forEach((user) => {
            if (user.rooms.includes(roomId)) {
              user.ws.send(
                JSON.stringify({
                  type: "chat",
                  message,
                  roomId,
                  senderId: user.userId,
                })
              );
            }
          });
        } catch (e) {
          console.error(e);
          ws.send(
            JSON.stringify({
              message: "There was an error sending the message",
            })
          );
        }
      }
    } catch(e){
      ws.send(
        JSON.stringify({
          message: "Error sending chat",
        })
      )
    }
  });
  ws.on("close", function disconnect() {
    users.delete(ws);
  });
});
