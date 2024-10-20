import passport from '../config/passport.js';
import { AddNewLocalUser } from '../models/usersModel.js';


export const registerLocalUser = async (req, res) => {
    try {
        const email = req.body.email;
        const unhashedPassword = req.body.password;
        const user = await AddNewLocalUser(email, unhashedPassword);
    if (user) {
      console.log("New user added:", user);
      res.status(201).json({ message: "User registered successfully." });
    } else {
      res.status(400).json({ error: "User already exists"});
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Could not add user at this time. Please try again later." });
    };
};
// In authControllers.js

export const loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err); // Handle error
      }
      if (!user) {
        return res.redirect('/auth/login'); // Redirect if authentication fails
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err); // Handle login error
        }
        return res.json({Message: "home"}); // Redirect to home if login is successful
      });
    })(req, res, next);
  };
  

//add logout functionality
export const logoutUser = (req, res) => {
    
}