import { pool } from "../../../config/db"

// Create user service
 const createUser = async (name:string,email:string)=>{
      const result = await pool.query(
            `INSERT  INTO users(name,email) VALUES($1, $2) RETURNING *`,
            [name,email]
        );
        return result;

 };

 // get user service
 const getUser = async () =>{
    const result = await  pool.query(`SELECT * FROM users`);
    return result;
 }




 // export function 
 export const userService = {
    createUser,
    getUser
 }