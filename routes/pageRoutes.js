import express from "express"
import {ensureAuthenticated} from "../middlewares/authMiddleware.js"
const router = express.Router();


router.get("/", (req, res) => {
    res.render("login.ejs");
  })  
router.use(ensureAuthenticated);
  
router.get("/search", (req, res) => {
    res.render("search.ejs")
  })

router.get("/favorites", (req, res) => {
    res.render("favorites.ejs")
  })
router.get("/home", (req, res) => {
    res.render("home.ejs");
  });

export default router;
  