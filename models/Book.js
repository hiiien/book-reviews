import { pool } from "../config/database.js";

class Book {

    //adds the book if it doesnt exist to the DB
    //returns the result to ensure success
    //data contains book title, author and openlibrary coverID
    static async addBook(data) { 
        const { title, author, cover_id } = data;
        const query = `
            INSERT INTO books (title, author, cover_id)
            VALUES ($1, $2, $3)
            RETURNING *;      
        `;
        const result = await pool.query(query, [title, author, cover_id]);
        return result.rows[0];
    };

    //used to check if book exists already
    //returns undefined or the book row
    static async getBook(cover_id){ 
        const query = `
            SELECT * FROM books WHERE cover_id = $1;
        `;
        const result = await pool.query(query, [cover_id]);
        return result.rows[0]; 
    };

};

export default Book;