import express from 'express'
import { loginUser, logoutUser, registerLocalUser } from '../controllers/authControllers.js'

const router = express.Router();

router.post('/register', registerLocalUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/login', (req, res) => {
    res.json({Message: "hii"}); // Render login page
  });
export default router