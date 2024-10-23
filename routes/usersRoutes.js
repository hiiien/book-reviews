import express from 'express'
import { deleteUser } from '../controllers/usersControllers.js'


const router = express.Router();

router.delete("/delete", deleteUser);

export default router;

