import express from "express";
import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
const JWT_SECRET = process.env.JWT_SECRET || "123123";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "incorrect format",
    });
  }
  const { username, password, name } = result.data;

  try {
    const user = await prismaClient.user.create({
      data: {
        email: username,
        password,
        name,
      },
    });

    res.json({
      userId: user.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating user",
    });
  }
});

app.post("/signin", async (req, res) => {
  const result = SigninSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "incorrect format",
    });
  }
  const { username, password } = result.data;

  const user = await prismaClient.user.findFirst({
    where: {
      email: username,
      password
    }
  })

  if(!user) {
    return res.status(403).json({
      message: "Not authorized"
    })
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET,
  );

  res.json({
    token,
  });
});

app.post("/room", middleware, async (req, res) => {
  const result = CreateRoomSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "incorrect format",
    });
  }
  const {name} = result.data;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  const room = await prismaClient.room.create({
    data: {
      slug: name,
      adminId: userId
    }
  })
  res.json({
    roomId: room.id,
  });
});

app.listen(3002);
