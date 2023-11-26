import { Router } from "express";
import {
  getAllUsers,
  getUserByUsername,
  signUserIn,
  createUser,
} from "../controllers/usersController";

export const usersRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         name:
 *           type: string
 *         avatar_url:
 *           type: string
 *           format: url
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieves all users
 *     description: Provides a list of all users in the system.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
usersRouter.get("/users", getAllUsers);

/**
 * @swagger
 * /api/users/{username}:
 *   get:
 *     summary: Retrieves a user by username
 *     description: Provides details of a specific user identified by username.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user to retrieve
 *     responses:
 *       200:
 *         description: Details of a user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
usersRouter.get("/users/:username", getUserByUsername);

/**
 * @swagger
 * /api/users/signin:
 *   post:
 *     summary: Signs a user in
 *     description: Authenticates a user and returns a JWT token upon successful authentication.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the user account
 *     responses:
 *       200:
 *         description: Authentication successful. Returns a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: User not found
 */
usersRouter.post("/users/signin", signUserIn);

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Creates a new user
 *     description: Allows for the creation of a new user in the system.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, name, password]
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the user
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the user account
 *               avatar_url:
 *                 type: string
 *                 format: uri
 *                 description: URL of the user's avatar image (optional)
 *     responses:
 *       201:
 *         description: User created successfully. Returns a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the created user
 *       409:
 *         description: User already exists
 */
usersRouter.post("/users/signup", createUser);
