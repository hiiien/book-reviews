import { GetABook, GetAllBooks, AddNewBookModel } from "../models/booksModels.js";
import axios from 'axios'

//'rating': 'ratings_sortable desc'
//TODO: change the mapping into an external function to use with other controller functions
export const fetchYourBooks = async (req, res) => {
    try {
        const books = await GetAllBooks(); //gets all the books in ascending order by title
        const booksWithCover = books.map((book) =>{ //makes a map to add the coverURL keyvalue pair
            const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
            return {
                ...book, //spread operator makes a copy of the book object and adds the key value cover url to it
                coverUrl
            };
        });
        res.json(booksWithCover).status(200); //send book object with url to frontend
    } catch (error) {
        console.log('Error fetching books:', error);
        res.status(500).json({error: 'An error occured while fetching books'});
    };
};



//adds a new book to your collection
//why? for your personal book list
export const insertNewBook = async (req, res) => {
    try {
        const title = req.body.title;
        const author = req.body.author;
        const cover_id = req.body.cover_id;
        await AddNewBookModel(title, author, cover_id);
        console.log("book added succesfully");
        res.status(200);
    } catch (error) {
        console.log('Error adding books:', error);
        res.status(500).json({error: 'An error occured while adding the book'});
    }
}

export const fetchOneBook = async (req, res) => {
    try {
        const id = req.params.id * 1;
        const response = await GetABook(id);
        console.log("fetched book succesfully");
        res.json(response).status(200);
    } catch (error) {
        console.log('Error fetching book', error);
        res.status(500).json({error: 'An error occured while fetching the book'});
    }
}

