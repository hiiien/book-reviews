import Note from "../models/Note.js"
import UserBook from "../models/UserBook.js";


//adds a new note corresponding to a userBook
export const postNote = async (req, res) => {
    try {
        const { chapter_number, content } = req.body; // Destructure body parameters
        const user_book_id = req.params.user_book_id * 1;

        //ensuring the variables are integers
        if (!Number.isInteger(user_book_id)) {
            return res.status(400).json({
                message: "URL param must be an integer!"
            });
        }

        if(!chapter_number || !content){ //ensure correct data
            return res.status(400).json({
                message: "Invalid request, must include user_book_id, chapter_number, and content"
            });
        };

        const user_id = req.user.user_id;
        const response = await UserBook.findUserBookByID(user_book_id); //checks for user_book corresponding to the note
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

        const success = await Note.insertNewNote({ user_book_id, chapter_number, content });
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
        });
    };
};

export const patchNote = async (req, res) => {
    try {
        const { user_book_id, note_id } = req.params;
        const { chapter_number, content } = req.body;

        //ensuring the variables are integers
        if (!Number.isInteger(user_book_id) || !Number.isInteger(note_id)) { 
            return res.status(400).json({
                message: "URL param must be an integer!"
            });
        }

        if(!chapter_number && !content){ //ensure correct data
            return res.status(400).json({
                message: "Invalid request, must include user_book_id, chapter_number, and content"
            });
        };

        const user_id = req.user.user_id;
        const response = await UserBook.findUserBookByID(user_book_id); //checks for user_book corresponding to the note
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

        var success;
        if (chapter_number !== null && content !== null && content !== "") {
            // Update both chapter number and content
            success = await Note.updateNote((chapter_number * 1), content, (note_id * 1));
        } else if (chapter_number !== null) {
            // Update only chapter number
            success = await Note.updateNoteChapter((chapter_number * 1), (note_id * 1));
        } else if (content !== "") {
            // Update only content
            success = await Note.updateNoteContent(content, (note_id * 1));
        } else {
            return res.status(400).json({
                message: "No valid fields to update",
            });
        }
        

        if(success.rowCount === 0){
            return res.status(400).json({
                message: "No note updated"
            });
        };

        return res.status(200).json({
            message: "Note successfully updated",
            data: success.rows[0]
        });


    } catch (error) {
        return res.status(500).json({ //return error
            message: "Error updated note",
            error: error
        });
    }
}

export const deleteNote = async (req, res) => {
    try {
        const { user_book_id, note_id } = req.params;
        const user_id = req.user.user_id;

        //ensuring the variables are integers
        if (!Number.isInteger(user_book_id) || !Number.isInteger(note_id)) {
            return res.status(400).json({
                message: "URL param must be an integer!"
            });
        }

        const response = await UserBook.findUserBookByID(user_book_id); //checks for user_book corresponding to the note
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

        const success = await Note.removeNote(note_id);
        if(success.rowCount === 0){
            return res.status(400).json({
                message: "Note could not be deleted"
            });
        }

        return res.status(200).json({
            message: "Note successfully deleted!",
            data: success.rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting note",
            error: error
        });
    };
};