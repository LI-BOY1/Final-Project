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

    //verify rating 
    if(!ratNumber)
        throw new Error("the input rating is not valid!");
    if(ratNumber !== Number(newComment.rating))
        throw new Error("rating should be postive whole number!");

    const trainer = await trainerData.getTrainerById(req.params.id);
    const trainerId = trainer._id;
    const comment = await commentData.addComment(newComment.comment, trainerId, ratNumber);
    //still need add member to comment, need complete it after completing login system

    //add flash
    req.flash('success', 'Successfully made a new comment!');
    res.redirect(`/fitclub/trainers/${trainerId}`);
}));

router.delete('/:commentId', async(req, res) => {
    const { id, commentId } = req.params;
    await trainerData.getTrainerById(id);
    trainerData.removeCommentFromTrainer(id, commentId);
    await commentData.getCommentById(commentId);
    //it seems that we do not need to add comment to member????????
    // const commentMemberId = comment.memberId;
    // await memberData.removeCommentFromMember(commentMemberId, commentId);
    commentData.deleteComment(commentId);
    //add flash
    req.flash('success', 'Successfully deleted comment!');
    res.redirect(`/fitclub/trainers/${id}`);
});
module.exports = router;
