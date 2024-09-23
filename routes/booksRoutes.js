import express from 'express'
import { fetchYourBooks, insertNewBook, fetchOneBook } from '../controllers/booksControllers.js'

const router = express.Router();

router.get('/', fetchYourBooks); //routes to the controller for displaying books
router.post('/', insertNewBook);
router.get('/:id', fetchOneBook);
export default router