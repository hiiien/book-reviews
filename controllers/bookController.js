import Book from "../models/Book.js";

//creates a new book
//used as a helper to the userBooks adding new books as users interact
//with more books from the openlibraries search
export const createBook = async (req, res) => {
    try {
        const book = req.body; //{title, author, cover_id}
        if(Object.keys(book).legnth != 3){
            return {status: 'error', code: 1, message: 'incorrect format of book data'};
        }
        const exists = await Book.getBook(book); //checks if the book already exists in the database before adding it send back the row
        if(exists){
            console.log("Book already exists");
            return {status: 'error', code: 2, message: 'book already exists'};
        };
        const response = await Book.addBook(req.body); //req.body should be {title, author, cover_id};
        if(response){
            console.log(`${req.body.title} added to DB`);
            return {status: 'success', code: 3, message: 'book successfully added', response: response};
        }
    } catch (error) {
        console.log(`Error adding ${req.body.title} to DB`);
        return {status: 'error', code: 4, message: 'error adding book'};
    }
}//this file might be useless
