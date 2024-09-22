import express from 'express'
import { listYourBooks } from '../controllers/booksControllers.js'

const router = express.Router();

router.get('/', listYourBooks);

export default router