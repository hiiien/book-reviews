import express from 'express'
import { insertNewReview, patchOneReview } from '../controllers/reviewController.js'

const router = express.Router();

router.post('/', insertNewReview); //routes to the controller for displaying books
router.patch('/:id', patchOneReview);
export default router