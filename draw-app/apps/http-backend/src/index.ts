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

app.post("signin", (req, res) => {
  const result = SigninSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "incorrect format",
    });
  }
  const { username, password } = result.data;

  const userId = 1;
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET,
  );

  res.json({
    token,
  });
});

app.post("room", middleware, (req, res) => {
  const result = CreateRoomSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "incorrect format",
    });
  }
  res.json({
    roomId: 123,
  });
});

app.listen(3002);
