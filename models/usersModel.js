import { pool } from "../config/database.js"
import bcrypt from "bcryptjs"

export const CreateUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(254) NOT NULL UNIQUE, 
        password VARCHAR(100),  
        login_type VARCHAR(10),
        google_id BIGINT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        );
    `
    try {
        await pool.query(query);
        console.log("Users table created successfully or already exists");
    } catch (error) {
        console.log("Error creating table: ", error);
    };
};

export const FindUserByID = async (email) => {
    const response = await pool.query("SELECT * FROM users WHERE email = $1", [email]); // finds user where email matches
    return response.rows[0];
}

export const AddNewLocalUser = async (email, unhashedPassword, saltRounds) => {
    bcrypt.hash(unhashedPassword, saltRounds, async function(err, hash) {
        if (err){
            console.log("Error Hashing Password: ", error);
            return 
        };
        try {
           await pool.query(`
                INSERT INTO users(email, password, login_type) 
                VALUES ($1, $2, $3)
                `, [email, hash, "local"]);
        } catch (dbErr) {
                console.log("Error storing local user: ", dbErr);
        };
    });
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

export const ValidatePassword = async (email, enteredPassword) => {
    const validPassword = await pool.query("SELECT password FROM users WHERE email = $1", [email]);
    return await bcrypt.compare(enteredPassword, validPassword); //returns true or false
}

