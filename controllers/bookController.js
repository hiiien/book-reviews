import Book from "../models/Book.js";

//creates a new book
//used as a helper to the userBooks adding new books as users interact
//with more books from the openlibraries search
export const createBook = async (req, res) => {
    try {
        const cover_id = req.body.cover_id;
        const exists = await Book.getBook(cover_id); //checks if the book already exists in the database before adding it
        if(exists){
            console.log("Book already exists");
            return false;
        };
        const response = await Book.addBook(req.body); //req.body should be {title, author, cover_id};
        if(response){
            console.log(`${req.body.title} added to DB`);
            return true;
        }
    } catch (error) {
        console.log(`Error adding ${req.body.title} to DB`);
        return null;
    }
}

