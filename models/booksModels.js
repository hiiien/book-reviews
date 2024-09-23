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

export const CreateBooksTable = async () => { //creates the table
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

export const AddNewBookModel = async (book) => {
    const title = book.title;
    const author = book.author;
    const cover_id = book.cover_id;
    const response = await pool.query(`
        INSERT INTO book (title, author, cover_id)
        VALUES ($1, $2, $3)
        RETURNING book_id;
        `);
    return response.rows[0];
    
}
//TODO: add different sorting optionality
export const GetAllBooks = async () => { //gets all books by title
    const result = await pool.query('Select * FROM books ORDER BY title');
    return result.rows;
}

// export const getSingleBook = async () => {
//     const result = await pool.query('Select * FROM books ')
// }