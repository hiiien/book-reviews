import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs"
import { FindUserByEmail, FindUserByID } from "../models/usersModel.js";
import passport from "passport";

//TODO: add google strategy 


passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.user_id);
    done(null, user.user_id);
});

passport.deserializeUser(async (user_id, done) => {
    console.log('Deserializing user:', user_id);
    try {
        const result = await FindUserByID(user_id); //gets full user info
        if (result) {
            console.log('User found:', result);
            return done(null, result); // Pass the user object to done
          } else {
            console.log('No user found');
            return done(null, false);
          }
    } catch (error) {
        console.log("Error deserializing user")
        done(error);
    }
})


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const result = await FindUserByEmail(email);
            if (!result || result.rows.length <= 0) { // Add a null check for result
                return done(null, false, { message: 'Incorrect email or password.' });
              }
            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password);
            if(match){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Incorrect email or password.'});
            }
        } catch (error) {
            return done(error)
        };
}));

export default passport;