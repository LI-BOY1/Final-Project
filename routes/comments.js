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
const xss = require('xss');

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

    if(!found){
        req.flash("error", "member isn't taking the trainer's course, so can't leave comment on that trainer");
        return res.redirect(`/fitclub/trainers/${trainerId}`);
    }

    let newComment = req.body;

    let a = xss(newComment.rating);
    let b = xss(newComment.comment);


    if(!newComment) 
        throw new ExpressError('Invalid comment!', 400);
    if(!b)
        throw new ExpressError("Not provide a comment info!", 400);
    if(!a)
        throw new ExpressError("Not provide a rating!", 400);
    let ratNumber = parseInt(a);

    //verify rating 
    if(!ratNumber)
        throw new Error("the input rating is not valid!");
    if(ratNumber !== Number(a))
        throw new Error("rating should be postive whole number!");



    // create new comment, add it to Comment collection, and add its id to member and trainer with id of id and trainerId
    const comment = await commentData.addComment(memberId, username, b, trainerId, ratNumber);
    //still need add member to comment, need complete it after completing login system

    //add flash
    req.flash('success', 'Successfully made a new comment!');
    res.redirect(`/fitclub/trainers/${trainerId}`);


}));





module.exports = router;
