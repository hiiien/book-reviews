import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/usersRoutes.js'
import userBookRoutes from './routes/userBookRoutes.js'
import pageRoutes from './routes/pageRoutes.js'
import { config } from "dotenv";
import passport from './config/passport.js';
import { ensureAuthenticated } from './middlewares/authMiddleware.js';


const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config(); //config the env
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
      secret: process.env.SESSION_PASS,
      resave: false, //can look up how to store session with a postgres store
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60
      }
    })
  );

  app.use(passport.initialize()); //initializes passport allowing it to intercept and process loging request
  app.use(passport.session()); //manages persistant 

// Serve static files (if any)
app.use(express.static(path.join(__dirname, 'public')));


app.use('/auth', authRoutes);
app.use('/', pageRoutes);

app.use(ensureAuthenticated);


app.use('/api/user', userRoutes);
app.use('/api/book', userBookRoutes);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});