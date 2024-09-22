import { getAllBooks } from "../models/booksModels.js";
import axios from 'axios'

export const listYourBooks = async (req, res) => {
    try {
        const books = await getAllBooks();
        console.log(books);
        const booksWithCover = books.map((book) =>{
            const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
            return {
                ...book,
                coverUrl
            };
        });
        res.json(booksWithCover);
    } catch (error) {
        console.log('Error fetching books:', error);
        res.status(500).json({error: 'An error occured while fetching books'});
    };
};