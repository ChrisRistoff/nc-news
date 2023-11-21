const { Router } = require("express");
const { getAllUsers, getUserByUsername } = require("../controllers/usersController");


const usersRouter = Router()

usersRouter.get("/users", getAllUsers)
usersRouter.get("/users/:username", getUserByUsername)

module.exports = usersRouter
