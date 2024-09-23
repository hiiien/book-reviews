import express from 'express'
import { listAllBooks } from '../controllers/booksControllers.js'

const router = express.Router();

router.get('/', listAllBooks); //routes to the controller for displaying books

export default router