import { GetAllBooks } from "../models/booksModels.js";
import axios from 'axios'


//TODO: change the mapping into an external function to use with other controller functions
export const listAllBooks = async (req, res) => {
    try {
        const books = await GetAllBooks(); //gets all the books in ascending order by title
        console.log(books);
        const booksWithCover = books.map((book) =>{ //makes a map to add the coverURL keyvalue pair
            const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
            return {
                ...book, //spread operator makes a copy of the book object and adds the key value cover url to it
                coverUrl
            };
        });
        res.json(booksWithCover); //send book object with url to frontend
    } catch (error) {
        console.log('Error fetching books:', error);
        res.status(500).json({error: 'An error occured while fetching books'});
    };
};

