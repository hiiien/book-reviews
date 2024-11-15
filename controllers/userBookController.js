import UserBook from "../models/UserBook.js";
import Book from "../models/Book.js";

export const createUserBook = async (req, res) => {
    try{
        const {title, author, cover_id, status} = req.body; //extracting values
        if(!title || !author || !cover_id || !status){
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


        console.log("Using book ID: ", book_id);
        const newUserBook = {user_id, book_id, status};
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
        const userBook = await UserBook.findUserBookByID(user_book_id);

        if(!userBook){
            return res.status(400).json({message: "User book does not exist or was already deleted"});     
        };

        const user_id = req.user.user_id;
        if(user_id != userBook.user_id){
            return res.status(401).json({
                message: "User cannot delete record not belonging to them"
            });
        };

        const response = await UserBook.removeUserBook(user_book_id); //add some kind of check for succesful deletion   
        console.log(response);
        return res.status(200).json({message: "Successfully deleted user book"});
        
        
    } catch (err) {
        console.log("Error deleting book. Error: ", err);
        return res.status(500).json({message: "Error adding your book. Try again"});
    }
}