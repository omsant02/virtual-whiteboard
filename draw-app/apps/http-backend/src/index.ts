import express from "express"
import * as z from "zod"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./config"
import { middleware } from "./middleware"

const app = express()
app.use(express.json())

const userValidation = z.object({
    username: z.email(),
    password: z.string()
})

type UserValidation = z.infer<typeof userValidation>

app.post("/signup", (req, res) => {
    const result = userValidation.safeParse(req.body);
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
    const result = userValidation.safeParse(req.body);
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
    res.json({
        roomId: 123
    })
})

app.listen(3002)