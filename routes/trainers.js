const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const data = require('../data');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const trainerData = data.trainers;
const memberData = data.members;
const courseData = data.courses;
const commentData = data.comments;

router.get('/', catchAsync (async(req, res) => {
    const trainerList = await trainerData.getAllTrainers();
    res.render('trainers/index', {trainer: trainerList});
}));

router.get('/:id', catchAsync (async (req, res)=>{
    const oneTrainer = await trainerData.getTrainerById(req.params.id);
    const trainerComList = oneTrainer.comment;
    let commentForThatTrainer = [];
    for(let i = 0; i < trainerComList.length; i ++){
        commentForThatTrainer[i] = await commentData.getCommentById(trainerComList[i]);
    }
    res.render('trainers/show', {trainer: oneTrainer, comment: commentForThatTrainer});
}));

router.get('/:id/edit', catchAsync (async (req, res) => {
    const oneTrainer = await trainerData.getTrainerById(req.params.id);
    res.render('trainers/edit', {trainer: oneTrainer});
}));


module.exports = router;