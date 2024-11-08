import express from 'express'
import {createBook} from "../controllers/bookController.js";

const router = express.Router();

router.post('/', createBook);

export default router;