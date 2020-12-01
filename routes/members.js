const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const data = require('../data');
const catchAsync = require('../utils/catchAsync');
const trainerData = data.trainers;
const memberData = data.members;
const courseData = data.courses;
const commentData = data.comments;

router.get('/', catchAsync(async(req, res) => {
    const starTrainers = await trainerData.getTopThreeTrainers();
    res.render('home', {trainer: starTrainers});
}))
router.get('/register', catchAsync(async(req, res) => {
    res.render('users/register');
}));

router.get('/login', catchAsync(async(req, res) => {
    res.render('users/login');
}));

module.exports = router;