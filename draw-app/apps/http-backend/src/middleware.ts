import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? "";

  interface CustomJwtPayload extends JwtPayload {
    userId: string;
  }

  const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

  if (decoded) {
    req.userId = decoded.userId;
    next()
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}
