import { pool } from "../config/database.js";

class UserBook {
    //data is book title, author, and cover_id
    static async addUserBook(data){
        const { user_id, book_id, status} = data;
        const query = `
            INSERT INTO user_books (user_id, book_id, status)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await pool.query(query, [user_id, book_id, status]);
        return result;
    };


    static async removeUserBook(user_book_id){
        const query = `
            DELETE FROM user_books
            WHERE user_book_id = $1
            RETURNING *;
        `
        const result = await pool.query(query, [user_book_id]);
        return result.rows[0]
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
};

export default UserBook;