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
            cover_id INT NOT NULL UNIQUE 
        );
    `;
    await pool.query(query);
};

//adds a new book
export const AddNewBookModel = async (title, author, cover_id) => {
    const response = await pool.query(`
        INSERT INTO books (title, author, cover_id)
        VALUES ($1, $2, $3);
        `,
    [title, author, cover_id]);
    return;
}

//gets a single book to display personal book page when you click on it
export const GetABook = async (id) => {
    const result = await pool.query(`
       SELECT * FROM books WHERE book_id = $1 
        `, [id]);
    return result.rows[0];
}

//TODO: add different sorting optionality
export const GetAllBooks = async () => { //gets all books by title
    const result = await pool.query('Select * FROM books ORDER BY title');
    return result.rows;
}

// export const getSingleBook = async () => {
//     const result = await pool.query('Select * FROM books ')
// }