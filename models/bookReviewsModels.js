import { pool } from '../config/database.js';


export const AddNewReview = async (review, user_id) => {
     await pool.query(`
        INSERT INTO reviews (book_id, review_text, review_rating, user_id) 
        VALUES ($1, $2, $3, $4);
        `, [review.book_id, review.review_text, review.review_rating, user_id]
    );
};

export const EditOneReview = async (review, user_id) => {
     await pool.query(`
        UPDATE reviews 
        SET review_text = $1, review_rating = $2 
        WHERE review_id = $3 AND user_id = $4
        `, [review.review_text, review.review_rating, review.review_id, user_id]);
};

