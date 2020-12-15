const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router({mergeParams: true});
const data = require('../data');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, isCommentAuthor } = require('../authentication');
const trainerData = data.trainers;
const memberData = data.members;
const courseData = data.courses;
const commentData = data.comments;

router.post('/', isLoggedIn, catchAsync (async(req, res) => {


    // first check if logged in
    // if logged in, check if user is the member
    // if user is the member, check if user taking the course with that trainer

    if(req.session.user.isTrainer)
        throw new ExpressError('trainer can not add comment', 400);

    const { id, username } = req.session.user;
    let memberId = id;
    const trainer = await trainerData.getTrainerById(req.params.id);
    const trainerId = trainer._id;
    let member = await memberData.getMemberById(memberId);

    // check whether the member and trainer have the common course Id
    let found = false;

    const list1 = trainer["course"];
    const list2 = member["coursesEnrolled"];
    let set = new Set();
    list2.forEach(el => set.add(el));

    for(let i = 0; i < list1.length; i++){

        if(set.has(list1[i])){
            found = true;
            break;
        }
    }

    if(!found)
        throw new ExpressError('member isn\'t taking the trainer\'s course, so can\'t leave comment on that trainer');


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



    // create new comment, add it to Comment collection, and add its id to member and trainer with id of id and trainerId
    const comment = await commentData.addComment(memberId, username, newComment.comment, trainerId, ratNumber);
    //still need add member to comment, need complete it after completing login system

    //add flash
    req.flash('success', 'Successfully made a new comment!');
    res.redirect(`/fitclub/trainers/${trainerId}`);


}));

// router.delete('/:commentId', isLoggedIn, isCommentAuthor, async(req, res) => {
//     const { id, commentId } = req.params;
//     await trainerData.getTrainerById(id);
//     trainerData.removeCommentFromTrainer(id, commentId);
//     await commentData.getCommentById(commentId);
//     //it seems that we do not need to add comment to member????????
//     // const commentMemberId = comment.memberId;
//     // await memberData.removeCommentFromMember(commentMemberId, commentId);
//     commentData.deleteComment(commentId);
//     //add flash
//     req.flash('success', 'Successfully deleted comment!');
//     res.redirect(`/fitclub/trainers/${id}`);
// });




module.exports = router;
