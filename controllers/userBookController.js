import UserBook from "../models/UserBook.js";
import Book from "../models/Book.js";



//creates a new user Book
//before creation checks if the book it corresponds to is in the db
//otherwise adds that book to the database and returns it book_id
export const createUserBook = async (req, res) => {
    try{
        const {title, author, cover_id, rating} = req.body; //extracting values
        let status = req.body.status;

        //validating data
        if(!title || !author || !cover_id){ 
            console.log("error: Invalid book contents, should be have title, author, cover_id, and status.");
            res.status(406).json({
                message: "Invalid book content. Should have title, author, cover_id, and status"
            });
        };

        //ensuring user is logged in
        const user_id =  req.user.user_id; 
        if(!user_id){
            return res.status(401).json({
                message: "No user found please log-in and try again"
            });
        }

        const book = {title, author, cover_id}; //passing book object to the model
        const foundBook = await Book.getBook(book);

        //checks if book was found
        //if not found make the book and use it's book id
        let book_id;
        if (!foundBook || foundBook.book_id === null) {
            const newBook = await Book.addBook(book);
            book_id = newBook.book_id;
        } else {
            book_id = foundBook.book_id;
        }

        //ensures valid status
        const validStatus = ['Not Started', 'Currently Reading', 'Finished'];
        status = validStatus.includes(status) ? status : "Not Started";

        //adds userBook to database
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

//deletes a user book
export const deleteUserBook = async (req, res) => {
    try {    
        const user_book_id = req.params.user_book_id * 1;
        const user_id = req.user.user_id;

        //ensuring the variables are integers
        if (!Number.isInteger(user_book_id)) {
            return res.status(400).json({
                message: "URL param must be an integer!"
            });
        }

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

//patches the rating column of a userBook
export const patchRating = async (req, res) => {
    try {
        const user_book_id = req.params.user_book_id;
        const rating = req.body.rating * 1;
        const user_id = req.user.user_id;

        //ensuring the variables are integers
        if (!Number.isInteger(user_book_id)) {
            return res.status(400).json({
                message: "URL param must be an integer!"
            });
        }

        if(rating < 1 || rating > 5){
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            })
        }

        const response = await UserBook.patchRating(rating, (user_book_id * 1), user_id);
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

//patches the status column of a userBook
export const patchStatus = async (req, res) => {
    try {
        const user_book_id = req.params.user_book_id;
        const status = req.body.status;
        const user_id = req.user.user_id;

        //ensuring the variables are integers
        if (!Number.isInteger(user_book_id)) {
            return res.status(400).json({
                message: "URL param must be an integer!"
            });
        }

        const validStatus = ['Not Started', 'Currently Reading', 'Finished'];
        if(!validStatus.includes(status)){
            return res.status(400).json({
                message: "Status must be Not Started, Currently Reading, or Finished"
            });
        };

        const response = await UserBook.patchStatus(status, (user_book_id * 1), user_id); 
        if(response.rowCount === 0){ 
            return res.status(400).json({
                message: "Could not find matching entry. No value patched"
            });
        };

        return res.status(200).json({message: "Status successfully changed!"});

    } catch (err) {
        console.log("Error patching status: ", err);
        return res.status(500).json({message: "Error patching review. Please try again."});
    }
}

//GETS the books information from allof the books that 
//a user has in their user books (favorites).
export const getUsersBooks = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        if(!user_id){ //ensures login before continuing 
            return res.status(401).json({
                message: "No user found. Log-in and try again"
            });
        };
        const response = await UserBook.fetchUsersBooks(user_id); //fetchs the book information

        if(response.rowCount === 0){ //if the user hasnt added any books returns message
            res.status(200).json({
                message: "You havent added any favorite books yet. Search for your favorite books and add some!"
            });
        };
        
        const bookWithCoverURL = response.rows.map((book) =>{ //makes a map to add the coverURL keyvalue pair
            const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg`
            return {
                ...book, //spread operator makes a copy of the book object and adds the key value cover url to it
                coverUrl
            };
        });

        return res.status(200).json({
            data: bookWithCoverURL
        });

    } catch (error) {
        console.log("Error fetching user's books: ", err);
        return res.status(500).json({message: "Error fetching users's books. Please try again later"});
    };
};

export const getUserBookWithNotes = async (req, res) => {
    try {
        const book_id = req.body.book_id * 1;
        const user_book_id = req.params.user_book_id * 1;
        const user_id = req.user.user_id * 1;
        
        //ensuring the variables are integers
        if (!Number.isInteger(user_book_id)) {
            return res.status(400).json({
                message: "URL param must be an integer!"
            });
        }
        
        if (!Number.isInteger(book_id)) {
            return res.status(400).json({
                message: "Book ID must be an integer!"
            });
        }

        if(!user_id){
            return res.status(401).json({
                message: "User not logged in"
            })
        }

        const response = await UserBook.fetchUserBookWithNote(book_id, user_book_id, user_id);
        console.log(response)
        if(response.rowCount === 0){
            return res.status(400).json({
                message: "No matching book found"
            })
        }

        const bookWithCoverURL = response.rows.map((book) =>{ //makes a map to add the coverURL keyvalue pair
            const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
            return {
                ...book, //spread operator makes a copy of the book object and adds the key value cover url to it
                coverUrl
            };
        });

        return res.status(200).json({
            message: "UserBook data and note successfully fetched",
            data: bookWithCoverURL
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching userBook and note data",
            error: error
        })
    }
}
