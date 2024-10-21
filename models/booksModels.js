import { pool } from '../config/database.js';

// export const CreateBooksTable = async () => { //creates the table
//     const query = `
//         CREATE TABLE IF NOT EXISTS books (
//             book_id SERIAL PRIMARY KEY,
//             title TEXT NOT NULL UNIQUE,
//             author TEXT,
//             cover_id INT NOT NULL UNIQUE 
//         );
//     `;
//     await pool.query(query);
// };

//adds a new book
export const AddNewBookModel = async (title, author, cover_id, user_id) => {
    await pool.query(`
        INSERT INTO books (title, author, cover_id, user_id)
        VALUES ($1, $2, $3, $4);
        `,
    [title, author, cover_id, user_id]);
    return;
}

//gets a single book to display personal book page when you click on it
export const GetBookAndReview = async (id, user_id) => {
    const result = await pool.query(`
        SELECT 
        books.book_id, books.title, books.author, books.cover_id,
        reviews.review_id, reviews.review_text, reviews.review_rating, reviews.review_date
        FROM users 
        JOIN books ON users.user_id = books.user_id 
        AND books.book_id = $1
        LEFT JOIN reviews ON users.user_id = reviews.user_id 
        AND reviews.book_id = $1
        WHERE users.user_id = $2;
        `, [id, user_id]);
        console.log(result.rows);
        return result.rows[0];
}

//TODO: add different sorting optionality
export const GetAllBooks = async (user_id) => { //gets all books by title
    const result = await pool.query('SELECT * FROM books WHERE user_id = $1 ORDER BY title ', [user_id]);
    return result.rows;
}

export const DeleteOneBookAndReview = async (id) => {
    await pool.query(
        `DELETE FROM books WHERE book_id = $1`,
        [id]
    );
};


