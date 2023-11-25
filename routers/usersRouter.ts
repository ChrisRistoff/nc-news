import { Router } from "express"
import { getAllUsers, getUserByUsername, signUserIn, createUser } from "../controllers/usersController"

export const usersRouter = Router()

usersRouter.get("/users", getAllUsers)
usersRouter.get("/users/:username", getUserByUsername)
usersRouter.post("/users/signin", signUserIn)
usersRouter.post("/users/signup", createUser)
