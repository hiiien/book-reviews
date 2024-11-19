
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
    };

    static async removeNote(note_id){
        const query = `
            DELETE FROM notes
            WHERE note_id = $1
            RETURNING *;
        `
        const result = await pool.query(query, [note_id]);
        return result;
    };


    //might change the update functions depending on how i do the frontend 
    static async updateNoteChapter(chapter_number, note_id){
        const query = `
            UPDATE notes
            SET chapter_number = $1
            WHERE note_id = $2
            RETURNING *;
        `
    }

    static async updateNoteContent(content, note_id){
        const query = `
            UPDATE notes
            SET content = $1
            WHERE note_id = $2
            RETURNING *;
        `
        const result = await pool.query(query, [content, note_id]);
        return result;
    }

    static async updateNote(chapter_number, content, note_id){
        const query = `
            UPDATE notes 
            SET chapter_number = $1, content = $2
            WHERE note_id = $3
            RETURNING *;
        `
        const result = await pool.query(query, [chapter_number, content, note_id]);
        return result;
    }
}

export default Note;