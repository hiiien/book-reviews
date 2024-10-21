import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
// import { CreateBooksTable } from './models/booksModels.js';
// import { CreateReviewsTable } from './models/bookReviewsModels.js';
// import { CreateUsersTable } from './models/usersModel.js';
import { fileURLToPath } from 'url';
import booksRoutes from './routes/booksRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import authRoutes from './routes/authRoutes.js'
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
app.use(ensureAuthenticated);
// app.use((req, res, next) => {
//     console.log('Session:', req.session); // Log session data
//     console.log('User:', req.user); // Log user data
//     next();
//   });
app.use('/api/book/', booksRoutes);
app.use('/api/review/', reviewRoutes);

// await CreateBooksTable()
//     .then(() => {
//         console.log('Books table created or already exists');
//     })
//     .catch((err) => {
//         console.error('Error creating books table', err);
//     });

//    await CreateReviewsTable()
//     .then(() => {
//         console.log('Reviews table created or already exists');
//     })
//     .catch((err) => {
//         console.error('Error creating reviews table', err);
//     });
//     await CreateBooksTable()
//     .then(() => {
//         console.log('Books table created or already exists');
//     })
//     .catch((err) => {
//         console.error('Error creating books table', err);
//     });

//    await CreateUsersTable()
//     .then(() => {
//         console.log('Users table created or already exists');
//     })
//     .catch((err) => {
//         console.error('Error creating users table', err);
//     });



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});