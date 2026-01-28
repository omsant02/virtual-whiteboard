import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
// import { JWT_SECRET } from "@repo/backend-common/config"
import {prismaClient} from "@repo/db/client"


const JWT_SECRET = process.env.JWT_SECRET || "123123";
const wss = new WebSocketServer({ port: 8080 });

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}
const users: User[] = []

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

  if (!decoded || !decoded.userId) {
    return null;
  }
  return decoded.userId;
  } catch (error) {
    return null
  }
  
}

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);

  if(userId == null) {
    ws.close();
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on("message", async(data) => {
    const parsedData = JSON.parse(data as unknown as string); // {type: "join-room", roomId: 1}

    if(parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws)
      user?.rooms.push(parsedData.roomId)
    }

    if(parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws)
      
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter(x => x === parsedData.roomId)
    }

    if(parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId,
          message,
          userId
        }
      })

      users.forEach(user => {
        if(user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }))
        }
      })
    }
  });
});

////////-----------

// import { WebSocket, WebSocketServer } from "ws";
// import jwt, { JwtPayload } from "jsonwebtoken";
// // import { JWT_SECRET } from "@repo/backend-common/config"
// import {prismaClient} from "@repo/db/client"


// const JWT_SECRET = process.env.JWT_SECRET || "123123";
// const wss = new WebSocketServer({ port: 8080 });

// interface CustomJwtPayload extends JwtPayload {
//   userId: string;
// }

// interface User {
//   ws: WebSocket,
//   rooms: string[],
//   userId: string
// }
// const users: User[] = []

// function checkUser(token: string): string | null {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

//   if (!decoded || !decoded.userId) {
//     return null;
//   }
//   return decoded.userId;
//   } catch (error) {
//     return null
//   }
  
// }

// async function findRoom(roomIdOrSlug: string | number) {
//   // Try to find by ID if it's a number
//   if (typeof roomIdOrSlug === 'number') {
//     return await prismaClient.room.findUnique({
//       where: { id: roomIdOrSlug }
//     });
//   }
  
//   // Try to parse as number
//   const numericId = parseInt(roomIdOrSlug);
//   if (!isNaN(numericId)) {
//     const room = await prismaClient.room.findUnique({
//       where: { id: numericId }
//     });
//     if (room) return room;
//   }
  
//   // Otherwise try to find by slug
//   return await prismaClient.room.findUnique({
//     where: { slug: roomIdOrSlug }
//   });
// }

// wss.on("connection", (ws, request) => {
//   const url = request.url;
//   if (!url) {
//     return;
//   }
//   const queryParams = new URLSearchParams(url.split("?")[1]);
//   const token = queryParams.get("token") || "";
//   const userId = checkUser(token);

//   if(userId == null) {
//     ws.close();
//     return null;
//   }

//   users.push({
//     userId,
//     rooms: [],
//     ws
//   })

//   ws.on("message", async (data) => {
//     const parsedData = JSON.parse(data as unknown as string); // {type: "join_room", roomId: "general-chat"}

//     if(parsedData.type === "join_room") {
//       const room = await findRoom(parsedData.roomId);

//       if (!room) {
//         ws.send(JSON.stringify({
//           type: "error",
//           message: "Room does not exist"
//         }));
//         return;
//       }

//       const user = users.find(x => x.ws === ws)
//       if (user && !user.rooms.includes(room.id.toString())) {
//         user.rooms.push(room.id.toString())
//         ws.send(JSON.stringify({
//           type: "joined_room",
//           roomId: room.id,
//           slug: room.slug
//         }));
//       }
//     }

//     if(parsedData.type === "leave_room") {
//       const room = await findRoom(parsedData.roomId);

//       if (!room) {
//         return;
//       }

//       const user = users.find(x => x.ws === ws)
//       if (!user) {
//         return;
//       }
//       user.rooms = user.rooms.filter(x => x !== room.id.toString())
//     }

//     if(parsedData.type === "chat") {
//       const message = parsedData.message;
//       const room = await findRoom(parsedData.roomId);

//       if (!room) {
//         ws.send(JSON.stringify({
//           type: "error",
//           message: "Room does not exist"
//         }));
//         return;
//       }

//       await prismaClient.chat.create({
//         data: {
//           roomId: room.id,
//           message,
//           userId
//         }
//       })

//       users.forEach(user => {
//         if(user.rooms.includes(room.id.toString())) {
//           user.ws.send(JSON.stringify({
//             type: "chat",
//             message: message,
//             roomId: room.id,
//             slug: room.slug
//           }))
//         }
//       })
//     }
//   });
// });
