import express from "express";
import { createUserBook, deleteUserBook, patchRating, patchStatus, getUsersBooks } from "../controllers/userBookController.js";

const router = express.Router();

router.get("/", getUsersBooks);
router.post("/", createUserBook);
router.delete("/:user_book_id", deleteUserBook);
router.patch("/rating/:user_book_id", patchRating);
router.patch("/status/:user_book_id", patchStatus);

export default router;