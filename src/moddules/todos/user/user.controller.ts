import { Request,Response } from "express";
import { pool } from "../../../config/db";
import { userService } from "./user.service";

// create user 
const createUser = async (req:Request, res:Response) => {
    const {name,email} = req.body;

    try{

          const result = await userService.createUser(name,email)    //* controller
       ;
        // console.log(result.rows[0])

        res.status(200).json({
            message:"data inserted",
            success: "true",
            data: result.rows[0],
        })

    }catch(err:any){
        res.status(500).json({
            success:false,
            message: err.message,
        })

    }
}

// get user
const getUser = async (req:Request, res:Response)=>{
       try{
           const result = await userService.getUser();   //* controller 

           res.status(200).json({
            success:true,
            message:"Users retrieved successfully",
            data:result.rows,
           })

       }catch(err:any){
            res.status(500).json({
            success:false,
            message:err.message,
            details:err,
            })
       }
} 

export const userController = {
    createUser,
    getUser
}