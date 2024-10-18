import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session"
import bcrypt from "bcryptjs"
import { FindUserByEmail, FindUserByID } from "../models/usersModel";
import passport from "passport";

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser(async (user_id, done) => {
    try {
        const result = await FindUserByEmail(user_id); //gets full user info
        if (result.rows.length > 0){
            done(null, result.rows[0]); //returns the user
        } else {
            done(null, false);
        }
    } catch (error) {
        done(error);
    }
})


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const result = await FindUserByEmail(email);
            if (result.rows.length <= 0) {
                return done(null, false, {message: 'Incorrect email or password.'});
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

