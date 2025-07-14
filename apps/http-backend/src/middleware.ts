import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";
import 'dotenv/config'
// import { JWT_SECRET } from "@repo/backend-common/config"

const JWT_SECRET = process.env.JWT_SECRET

interface IJwtPayload extends JwtPayload{
  userId?: string
}

export function userMiddleware(req: Request, res: Response, next: NextFunction){
  const token = req.headers["authorization"] ?? "";

  const verified = jwt.verify(token, JWT_SECRET as string) as IJwtPayload;

  if(verified){
    req.userId = verified.userId;
    next()
  } else {
    res.status(403).json({
      message: "Unauthorized"
    })
  }
}