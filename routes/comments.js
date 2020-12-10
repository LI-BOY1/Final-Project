const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router({mergeParams: true});
const data = require('../data');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const trainerData = data.trainers;
const memberData = data.members;
const courseData = data.courses;
const commentData = data.comments;

router.post('/', catchAsync (async(req, res) => {
    let newComment = req.body;
    if(!newComment) 
        throw new ExpressError('Invalid comment!', 400);
    if(!newComment.comment)
        throw new ExpressError("Not provide a comment info!", 400);
    if(!newComment.rating)
        throw new ExpressError("Not provide a rating!", 400);
    let ratNumber = parseInt(newComment.rating);
    const trainer = await trainerData.getTrainerById(req.params.id);
    const trainerId = trainer._id;
    const comment = await commentData.addComment(newComment.comment, trainerId, ratNumber);

    res.redirect(`/fitclub/trainers/${trainerId}`);
}));
module.exports = router;
