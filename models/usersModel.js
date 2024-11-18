import { pool } from "../config/database.js"
import bcrypt from "bcryptjs"
var saltRounds = 10;

export const FindUserByEmail = async (email) => {
    try {
        const response = await pool.query("SELECT * FROM users WHERE email = $1", [email]); // finds user where email matches
        return response;  
    } catch (error) {
        console.error("Error fetching user by email:", err);
        return null; 
    };
};

export const FindUserByID = async (user_id) => {
    try {
        const response = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]); // finds user where user_id matches
        return response.rows[0];
    } catch (error) {
        console.error("Error fetching user by id:", err);
        return null; 
    }; 
};

export const AddNewLocalUser = async (email, unhashedPassword) => {
    try {
        const hash = await bcrypt.hash(unhashedPassword, saltRounds); //hashed the password **DONT use the bcrypt hashing call back functions causes issues
        //created the new user in db
        const newUser = await pool.query(`
            INSERT INTO users(email, password, login_type)   
            VALUES ($1, $2, $3) RETURNING *
            `, [email, hash, "local"]);
        return newUser.rows[0]; //returns the user to check if it was successful
    } catch (dbErr) {
            console.log("Error storing local user: ", dbErr);
    };
};

export const AddNewGoogleUser = async (email, google_id) => {
    try {
        await pool.query(`
            INSERT INTO users (email, login_type, google_id) 
            VALUES ($1, $2, $3)
            `, [email, "google", google_id]);
    } catch (error) {
        console.log(error);
    }
}


export const DeleteUser = async (user_id) => {
    try {
        await pool.query(`
            DELETE FROM users 
            WHERE user_id = $1; 
            `, [user_id]);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}


