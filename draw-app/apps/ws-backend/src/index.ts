import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
// import { JWT_SECRET } from "@repo/backend-common/config"
const JWT_SECRET = process.env.JWT_SECRET || "123123";

const wss = new WebSocketServer({ port: 8080 });

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");

  if (!token) {
    ws.close();
    return;
  }

  const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

  if (!decoded || !decoded.userId) {
    ws.close();
    return;
  }

  ws.send("ka mantes");
  ws.on("message", (data) => {
    ws.send("pong");
  });
});
