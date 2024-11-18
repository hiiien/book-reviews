import Note from "../models/Note.js"
import UserBook from "../models/UserBook.js";


//adds a new note corresponding to a userBook
export const postNote = async (req, res) => {
    try {
        const noteData = req.body;
        console.log(noteData);
        if(!noteData.user_book_id || !noteData.chapter_number || !noteData.content){ //ensure correct data
            return res.status(400).json({
                message: "Invalid request, must include user_book_id, chapter_number, and content"
            });
        };

        const user_id = req.user.user_id;
        const response = await UserBook.findUserBookByID(noteData.user_book_id); //checks for user_book corresponding to the note
        if(response.rowCount === 0){ //if userBook does not exist return bad request
            return res.status(400).json({
                message: "User Book does not exist"
            });
        };

        if(response.rows[0].user_id != user_id){ //if user tries to make a note on a userBook not pertaining to them return
            return res.status(401).json({
                message: "Invalid login. Users can only add notes to their own books"
            });
        };

        const success = await Note.insertNewNote(noteData);
        if(success.rowCount === 0){ //if no row returned unsuccessful creation
            return res.status(500).json({
                message: "Note creation unsuccesful try again"
            });
        };

        return res.status(200).json({ //return success
            data: success.rows[0],
            message: "Note successfully created!"
        });

    } catch (error) {
        return res.status(500).json({ //return error
            message: "Error creating new note",
            error: error
        })
    }
    
}