import passport from '../config/passport.js';
import * as User from '../models/usersModel.js';

//registers a local user
export const registerLocalUser = async (req, res) => {
    try {
        const email = req.body.email;
        const unhashedPassword = req.body.password;
        const user = await User.AddNewLocalUser(email, unhashedPassword);
    if (user) {
      console.log("New user added:", user);
      res.status(201).json({ message: "Registered successfully!" });
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
        return res.status(401).json({"login": "failed"})//res.redirect('/auth/login'); // Redirect if authentication fails
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({"Success": "Logged in"});
      });
    })(req, res, next);
  };
  

//add logout functionality
export const logoutUser = (req, res) => {
    
}