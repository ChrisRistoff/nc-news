const { Router } = require("express");
const { getAllUsers, getUserByUsername, signUserIn, createUser } = require("../controllers/usersController");


const usersRouter = Router()

usersRouter.get("/users", getAllUsers)
usersRouter.get("/users/:username", getUserByUsername)
usersRouter.post("/users/signin", signUserIn)
usersRouter.post("/users/signup", createUser)

module.exports = usersRouter
