import express, { Request, Response } from "express";
import { pool } from "../../../config/db";
import { userController } from "./user.controller";

const router = express.Router();


//app.use("users",userRoutes)
router.post("/",userController.createUser)


// app.GET routers
router.get ("/",userController.getUser)


export const userRoutes =  router;