import express from "express";
import { createUserBook } from "../controllers/userBookController.js";

const router = express.router();

router.post("/", createUserBook);

export default router;