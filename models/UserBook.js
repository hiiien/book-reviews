import { pool } from "../config/database.js";

class UserBook {
    //data is book title, author, and cover_id
    static async addUserBook(data){
        const { user_id, book_id, status, rating} = data;
        const query = `
            INSERT INTO user_books (user_id, book_id, status, rating)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = await pool.query(query, [user_id, book_id, status, rating || null]); //if review is empty enter null
        return result;
    };


    static async removeUserBook(user_book_id, user_id){
        const query = `
            DELETE FROM user_books
            WHERE user_book_id = $1 AND user_id = $2
            RETURNING *;
        `
        const result = await pool.query(query, [user_book_id, user_id]);
        return result
    }


    static async findUserBookByID(user_book_id){
        const query = `
            SELECT *
            FROM user_books
            WHERE user_book_id = $1;
        `
        const result = await pool.query(query, [user_book_id]);
        return result.rows[0];
    };

    static async patchRating(rating, user_book_id, user_id){
        const query = `
            UPDATE user_books
            SET rating = $1
            WHERE user_book_id = $2 AND user_id = $3
            RETURNING *;
        `
        const result = await pool.query(query, [rating, user_book_id, user_id]);
        return result;
    };


    //REMEMBER the function variables are substituted into the $1, $2, $3 in the order they are passed into a function
    //this means if the function variables will be substituted into my query in the wrong order
    static async patchStatus(status, user_book_id, user_id){
        const query = `
            UPDATE user_books
            SET status = $1
            WHERE user_book_id = $2 AND user_id = $3
            RETURNING *;
        `
        const result = await pool.query(query, [status, user_book_id, user_id]);
        return result;
    }

    //fetches the book data for all of the books a user has in the user_books table
    static async fetchUsersBooks(user_id){
        const query = `
            SELECT books.title, books.author, books.cover_id, books.book_id, user_books.user_book_id 
            FROM user_books
            INNER JOIN books ON user_books.book_id = books.book_id 
            WHERE user_id = $1;
        `

        const result = await pool.query(query, [user_id]);
        return result;
    }
};



export default UserBook;