import express from "express";
import { createUserBook, deleteUserBook, patchRating, patchStatus, getUsersBooks, getUserBookWithNotes } from "../controllers/userBookController.js";
import { postNote, patchNote, deleteNote } from '../controllers/noteController.js'
const router = express.Router();

//UserBook routes
router.get("/", getUsersBooks);
router.get("/:user_book_id", getUserBookWithNotes)
router.post("/", createUserBook);
router.delete("/:user_book_id", deleteUserBook);
router.patch("/:user_book_id/rating", patchRating);
router.patch("/:user_book_id/status", patchStatus);

//Note routes
router.post("/:user_book_id/notes", postNote);
router.delete("/:user_book_id/notes/:note_id", deleteNote);
router.patch("/:user_book_id/notes/:note_id", patchNote);

export default router;