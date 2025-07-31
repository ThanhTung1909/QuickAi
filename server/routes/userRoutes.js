import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  getPublishedUserCreations,
  getUserCreations,
  toggleLikeCreations,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/get-user-creations", auth, getUserCreations);
userRouter.get("/get-published-creations", auth, getPublishedUserCreations);
userRouter.post("/toggle-like-creation", auth, toggleLikeCreations);

export default userRouter;
