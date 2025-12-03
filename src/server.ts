import { Result } from './../node_modules/@types/pg/index.d';
import { Message } from './../node_modules/esbuild/lib/main.d';
import express,{NextFunction, Request,Response} from "express";
// import {Pool} from "pg";
// import dotenv from "dotenv";
// import path from "path";
import { config } from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './moddules/todos/user/user.routes';



const app = express()
const port = config.port;

//parser or middleware ===> For parse the json data  
app.use(express.json());



// db call from db.ts
initDB();



app.get('/',logger, (req:Request, res:Response) => {
  res.send('Hello Alif !')
})


//  Users Crud 
app.use('/users', userRoutes )



// get single  user 
   app.get('/users/:id',async(req:Request, res:Response) =>{
    //    console.log(req.params.id)
     try{
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`,[req.params.id]);

        if(result.rows.length === 0 ){
            res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        else{
            res.status(200).json({
                success:true,
                message:"User fetched successfully",
                data:result.rows[0],
            })
        }

     }catch(err:any){
         res.status(500).json({
            success:false,
            message: err.message,
        })  
     }
     

   })

// Update user 
  app.put('/users/:id',async(req:Request, res:Response) =>{
     const {name,email} = req.body;
     try{
        const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING * `,[name,email,req.params.id]);

        if(result.rows.length === 0 ){
            res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        else{
            res.status(200).json({
                success:true,
                message:"User updated successfully",
                data:result.rows[0],
            })
        }

     }catch(err:any){
         res.status(500).json({
            success:false,
            message: err.message,
        })  
     }
     

   })

   // delete 
    app.delete('/users/:id',async(req:Request, res:Response) =>{ 
    //    console.log(req.params.id)
     try{
        const result = await pool.query(`DELETE FROM users WHERE id = $1`,[req.params.id]);

        if(result.rowCount === 0 ){
            res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        else{
            res.status(200).json({
                success:true,
                message:"User delete successfully",
                data:result.rows,
            })
        }

     }catch(err:any){
         res.status(500).json({
            success:false,
            message: err.message,
        })  
     }
     

   })


   //* Todos CRUD
   app.post("/todos",async(req:Request, res:Response)=>{
         const {user_id,title} = req.body;
         try{
             const result = await pool.query(`INSERT INTO todos(user_id,title) VALUES($1,$2) RETURNING *`, [user_id,title])

             res.status(201).json({
                success: true,
                message: "Todo created",
                data: result.rows[0]
             })
         }catch(err){
            res.status(500).json({
                success : false,
                message: "err.message"
            })

         }
   })

   // get all todos
   app.get("/todos",async (req:Request,res:Response)=>{
       try{
           const result = await  pool.query(`SELECT * FROM todos`);

           res.status(200).json({
            success:true,
            message:"todos retrieved successfully",
            data:result.rows,
           })

       }catch(err:any){
            res.status(500).json({
            success:false,
            message:err.message,
            details:err,
            })
       }
})


// Default route 
app.use((req,res)=>{
    res.status(404).json({
        success: false,
        message:"Route not found",
        path:req.path
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




//  await pool.query(`
//              CREATE TABLE IF NOT EXISTS todos(
//              id SERIAL PRIMARY KEY,
//              user_id INT REFERENCES users(id) ON DELETE CASCADE,
//              title VARCHAR(200) NOT NULL,
//              description DATE , 
//              created_at TIMESTAMP DEFAULT NOW(),
//              updated_at TIMESTAMP DEFAULT NOW()
//              )
//             `);


































