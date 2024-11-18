
import { pool } from "../config/database.js"

class Note {
    static async insertNewNote(data){
        const { user_book_id, chapter_number, content } = data;
        const query = `
            INSERT INTO notes (user_book_id, chapter_number, content) 
            VALUES ($1, $2, $3)
            RETURNING *;
        `
        const result = await pool.query(query, [user_book_id, chapter_number, content]);
        return result;
    }
}

export default Note;