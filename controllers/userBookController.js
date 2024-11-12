import UserBook from "../models/UserBook.js";
import Book from "../models/Book.js";

export const createUserBook = async (req, res) => {
    try{
        const {title, author, cover_id, status} = req.body; //extracting values
        if(!title || !author || !cover_id || status){
            console.log("error: Invalid book contents, should be have title, author, cover_id, and status. Book: ", book);
            res.status(406).json({message: "Invalid book content. Should have title, author, cover_id, and status"});
        };
        const book = {title, author, status}; //passing book object to the model
        var response = await Book.getBook(book);
        if(!response){
            response = await Book.addBook();
        };    
        const book_id = response.book_id;
        const user_id =  req.user.user_id;
        if(!user_id){
            res.status(401).json({message: "No user found please log-in and try again"});
        }
        const newUserBook = {user_id, book_id, status};
        const success = await UserBook.addUserBook(newUserBook);
        if(success){
            res.status(200).json({message: "Book successfully added!"});
        }
    } catch(err) {
        console.log("Error adding book. Error: ", err);
        res.status(500).json({message: "Error adding your book. Try again"});
    };
};

export const deleteUserBook = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const user_book_id = req.params.user_book_id;
        const userBook = await UserBook.findUserBook(user_book_id);
        if(!userBook){
            res.status(400).json({message: "User book does not exist or was already deleted"});     
        };
        if(user_id != userBook.user_id){
            res.status(401).json({message: "User cannot delete record not belonging to them"});
        };
        
        
    } catch (error) {
        
    }
}