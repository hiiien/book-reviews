import express from "express";
import { createUserBook, deleteUserBook } from "../controllers/userBookController.js";

const router = express.Router();

router.post("/", createUserBook);
router.delete("/:user_book_id", deleteUserBook);

export default router;