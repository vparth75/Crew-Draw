import express from "express"
import jwt from "jsonwebtoken"
import { userMiddleware } from "./middleware"
import 'dotenv/config';
// import { JWT_SECRET } from "@repo/backend-common/config"
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client"
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET

app.post("/signup", async(req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body)
  if(!parsedData.success){
    res.json({
      message: "Incorrect inputs"
    });
    return;
  }

  try{
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10)

    const user = await prismaClient.user.create({
      data: {
        username: parsedData.data.username,
        email: parsedData.data.email,
        password: hashedPassword
      }
    })
    
    res.json({
      userId: user.id
    })
  } catch(e) {
    res.status(411).json({
      message: "Failed"
    })
  }
})

app.post("/signin", async(req, res) => {

  const parsedData = SigninSchema.safeParse(req.body)
  if(!parsedData.success){
    res.json({
      message: "Invalid inputs"
    });
    return;
  }
  if(typeof parsedData.data.password != "string"){
    return
  }

  try{
    const user = await prismaClient.user.findFirst({
      where: {
        username: parsedData.data.username 
      },
      select: {
        id: true,
        password: true
      }
    })
    if(!user){
      res.status(401).json({ message: "Invalid credentials" });
      return
    }
    
    const comparePassword = await bcrypt.compare(parsedData.data.password, user.password)
    
    if(!comparePassword){
      res.status(401).json({ message: "Invalid credentials" })
    }

    const userId = user.id
    const token = jwt.sign({
      userId
    }, JWT_SECRET as string)

    res.json({
      token
    })

  } catch(e){
    res.status(500).json({ message: "Internal server error" })
  }
})

app.post("/create-room", userMiddleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body)
  if(!parsedData.success){
    res.json({
      message: "Invalid inputs"
    });
    return;
  }

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: Missing user ID" });
    return;
  }

  try{
    const userExists = await prismaClient.user.findUnique({
      where: { id: userId }
    });
    
    if (!userExists) {
      res.status(400).json({ message: "Invalid user ID" });
      return
    }
    
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId
      }
    })

    res.json({
      roomId: room.id
    })

  } catch(e){
    res.status(411).json({ message: "Room already exists" })
  }
})

app.get("/chats/:roomId", userMiddleware, async (req, res)=> {
  const roomId = req.params.roomId
  try{

    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId
      },
      orderBy: {
        sentAt: "desc"
      },
      take: 50
    })

    res.json({
      messages
    })
    
  } catch(e) {
    res.json({
      message: "Could not find messages"
    })
  }
})

app.get("/rooms/:slug", userMiddleware, async (req, res)=> {
  const slug = req.params.slug
  try{

    const room = await prismaClient.room.findFirst({
      where: {
        slug
      }
    })

    res.json({
      room
    })
    
  } catch(e) {
    res.json({
      message: "Could not find room"
    })
  }
})

app.listen(3001)