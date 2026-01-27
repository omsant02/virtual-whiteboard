import express from "express"
import * as z from "zod"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"
import { middleware } from "./middleware"
import {CreateUserSchema, SigninSchema, CreateRoomSchema} from "@repo/common/types"

const app = express()
app.use(express.json())

const userValidation = z.object({
    username: z.email(),
    password: z.string()
})

app.post("/signup", (req, res) => {
    const result = CreateUserSchema.safeParse(req.body);
    if(!result.success) {
        return res.status(400).json({
            message: "incorrect format"
        })
    }
    const {username, password} = result.data;

    res.json({
        userId: 123
    })
})

app.post("signin", (req, res) => {
    const result = SigninSchema.safeParse(req.body);
    if(!result.success) {
        return res.status(400).json({
            message: "incorrect format"
        })
    }
    const {username, password} = result.data;

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        token
    })
})

app.post("room", middleware,  (req, res) => {
    const result = CreateRoomSchema.safeParse(req.body);
    if(!result.success) {
        return res.status(400).json({
            message: "incorrect format"
        })
    }
    res.json({
        roomId: 123
    })
})

app.listen(3002)