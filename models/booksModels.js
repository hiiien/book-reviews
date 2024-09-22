import pkg from "pg";
import { config } from 'dotenv';
config();
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

export const createBooksTable = async () => { //creates the table
    const query = `
        CREATE TABLE IF NOT EXISTS books (
            book_id SERIAL PRIMARY KEY,
            title TEXT NOT NULL UNIQUE,
            author TEXT,
            cover_id INT
        );
    `;
    await pool.query(query);
};
//TODO: add different sorting optionality
export const getAllBooks = async () => { //gets all books by title
    const result = await pool.query('Select * FROM books ORDER BY title'
    );
    return result.rows;
}

// export const getSingleBook = async () => {
//     const result = await pool.query('Select * FROM books ')
// }