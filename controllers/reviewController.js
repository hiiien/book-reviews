import * as reviewsModels from '../models/bookReviewsModels.js'

export const insertNewReview = async (req, res) => {
    try {
        const review = req.body; //should contain book_id, review_text, review_rating
        await reviewsModels.AddNewReview(review);
        console.log("review added successfully");
        res.status(200);
    } catch (error) {
        console.log('Error adding review:', error);
        res.status(500).json({error: 'An error occured while adding the review'});
    };
};

export const patchOneReview = async (req, res) => {
    try {
    req.body.review_id *= 1
    req.body.review_rating *= 1
    const review = req.body; // should contain review_id, review_rating, review_text   
    await reviewsModels.EditOneReview(review);
    console.log("review patched succesfully");
    res.status(200);
    } catch (error) {
    console.log('Error patching review', error);
    res.status(500).json({error: 'An error occured while patching the review'});
    }
}