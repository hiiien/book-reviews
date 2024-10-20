import { pool } from "../config/database.js"
import bcrypt from "bcryptjs"
var saltRounds = 10;

export const CreateUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(254) NOT NULL UNIQUE, 
        password VARCHAR(100),  
        login_type VARCHAR(10),
        google_id BIGINT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `
    try {
        await pool.query(query);
    } catch (error) {
        console.log("Error creating table: ", error);
    };
};

export const FindUserByEmail = async (email) => {
    try {
        const response = await pool.query("SELECT * FROM users WHERE email = $1", [email]); // finds user where email matches
        return response;  
    } catch (error) {
        console.error("Error fetching user by email:", err);
        return null; 
    }
    
}

export const FindUserByID = async (user_id) => {
    try {
        const response = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]); // finds user where user_id matches
        return response;
    } catch (error) {
        console.error("Error fetching user by id:", err);
        return null; 
    }
    
}

export const AddNewLocalUser = async (email, unhashedPassword) => {
        try {
            const hash = await bcrypt.hash(unhashedPassword, saltRounds); //hashed the password
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



