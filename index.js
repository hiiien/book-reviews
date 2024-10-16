import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { CreateBooksTable } from './models/booksModels.js';
import { CreateReviewsTable } from './models/bookReviewsModels.js';
import { fileURLToPath } from 'url';
import booksRoutes from './routes/booksRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (if any)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/book/', booksRoutes);
app.use('/api/review/', reviewRoutes);

await CreateBooksTable()
    .then(() => {
        console.log('Books table created or already exists');
    })
    .catch((err) => {
        console.error('Error creating books table', err);
    });

   await CreateReviewsTable()
    .then(() => {
        console.log('Reviews table created or already exists');
    })
    .catch((err) => {
        console.error('Error creating reviews table', err);
    });


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});