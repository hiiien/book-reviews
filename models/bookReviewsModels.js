import { pool } from './booksModels.js';

export const CreateBooksTable = async () => { //creates the table
    const query = `
        CREATE TABLE IF NOT EXISTS reviews (
            review_id SERIAL PRIMARY KEY,
            book_id INT REFERENCES books(book_id) ON DELETE CASCADE NOT NULL,
            review_text TEXT NOT NULL,
            review_rating INT CHECK(review_rating >= 1 AND review_rating <= 5) NOT NULL,
            review_date DATE NOT NULL DEFAULT CURRENT_DATE
        );
    `;
    await pool.query(query);
};

export const AddNewReview = async (review) => {
    const response = db.query(`
        INSERT INTO review (book_id, review_text, review_rating) 
        VALUES ($1, $2, $3);
        `, [review.book_id, review.review_text, review.review_rating]
    );
};