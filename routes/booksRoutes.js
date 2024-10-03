import express from 'express'
import { fetchYourBooks, insertNewBook, fetchOneBookAndReview } from '../controllers/booksControllers.js'

const router = express.Router();

router.get('/', fetchYourBooks); //routes to the controller for displaying books
router.post('/', insertNewBook);
router.get('/:id', fetchOneBookAndReview);
export default router