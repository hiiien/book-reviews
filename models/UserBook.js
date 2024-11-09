import { pool } from "../config/database.js";

class userBook {

    //data is book title, author, and cover_id
    static async addUserBook(data){
        const { user_id, book_id, status} = data;
        const query = `
            INSERT INTO user_books (user_id, book_id, status)
            VALUES ($1, $2, $3)
            RETURNING *
        `

    }
};

export default userBook;