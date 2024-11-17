import UserBook from "../models/UserBook.js";
import Book from "../models/Book.js";


//TODO: might have to add default value for status
//Review can be empty
export const createUserBook = async (req, res) => {
    try{
        const {title, author, cover_id, rating} = req.body; //extracting values
        let status = req.body.status;
        if(!title || !author || !cover_id){
            console.log("error: Invalid book contents, should be have title, author, cover_id, and status.");
            res.status(406).json({
                message: "Invalid book content. Should have title, author, cover_id, and status"
            });
        };

        const user_id =  req.user.user_id;
        if(!user_id){
            return res.status(401).json({
                message: "No user found please log-in and try again"
            });
        }

        const book = {title, author, cover_id}; //passing book object to the model
        const foundBook = await Book.getBook(book);


        let book_id;
        if (!foundBook || foundBook.book_id === null) {
            const newBook = await Book.addBook(book);
            book_id = newBook.book_id;
        } else {
            book_id = foundBook.book_id;
        }

        if(status === '' || status === null){
            status = 'Not Started'
        }

        console.log("Using book ID: ", book_id);
        const newUserBook = {user_id, book_id, status, rating};
        const success = await UserBook.addUserBook(newUserBook);
        if(success.rows.length > 0){
            return res.status(200).json({
                message: "Book successfully added!"
            });
        } else {
            return res.status(400).json({
                message: "Failed to add userBook"
            })
        }
    } catch(err) {
        console.log("Error adding book. Error: ", err);
        res.status(500).json({message: "Error adding your book. Try again"});
    };
};

export const deleteUserBook = async (req, res) => {
    try {    
        const user_book_id = req.params.user_book_id;
        const user_id = req.user.user_id;


        const response = await UserBook.removeUserBook(user_book_id, user_id); //add some kind of check for succesful deletion   

        if(response.rowCount === 0){
            return res.status(400).json({
                message: "UserBook does not exist or was already deleted"
            });
        }

        return res.status(200).json({message: "Successfully deleted user book"});
        
        
    } catch (err) {
        console.log("Error deleting book. Error: ", err);
        return res.status(500).json({message: "Error adding your book. Try again"});
    }
}

export const patchRating = async (req, res) => {
    try {
        const user_book_id = req.params.user_book_id * 1;
        const rating = req.body.rating * 1;
        const user_id = req.user.user_id;
        console.log("user_book_id: ", user_book_id);
        console.log("rating: ", rating);
        console.log("user_id: ", user_id);
        const response = await UserBook.patchRating(rating, user_book_id, user_id);
        console.log(response);
        if(response.rowCount === 0){
            return res.status(400).json({
                message: "Could not find matching entry. No value patched"
            })
        }

        return res.status(200).json({message: "Rating successfully changed!"});

    } catch (err) {
        console.log("Error patching rating: ", err);
        return res.status(500).json({message: "Error patching review. Please try again."});
    }
}

export const patchStatus = async (req, res) => {
    try {
        const user_book_id = req.params.user_book_id * 1;
        const status = req.body.status;
        const user_id = req.user.user_id;
        const response = await UserBook.patchStatus(status, user_book_id, user_id);
        if(response.rowCount === 0){
            return res.status(400).json({
                message: "Could not find matching entry. No value patched"
            })
        }

        return res.status(200).json({message: "Status successfully changed!"});

    } catch (err) {
        console.log("Error patching status: ", err);
        return res.status(500).json({message: "Error patching review. Please try again."});
    }
}

