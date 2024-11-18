import express from "express"
import { postNote } from "../controllers/noteController.js"

const router = express.Router()

router.post("/", postNote);


export default router;