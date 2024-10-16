import { pool } from "../config/database.js"

export const CreateUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(254) NOT NULL UNIQUE, 
        password VARCHAR(100),
        login_type VARCHAR(10),
        google
        );
    `
}