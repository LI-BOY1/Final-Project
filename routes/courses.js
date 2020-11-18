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

router.get('/trainers/:id', catchAsync (async (req, res) => {
    const trainer = await trainerData.getTrainerById(req.params.id);
    let courseList = trainer.course;
    let courseInfo = [];
    for(let i = 0; i < courseList.length; i ++){
        const singleCourse = await courseData.getCourseById(courseList[i]);
        courseInfo[i] = singleCourse;
    } 
    res.render('trainers/courseIndex', {course: courseInfo, trainer: trainer});
}));
router.get('/trainers/:id/:courseId', catchAsync (async (req, res) => {
    const singleCourse = await courseData.getCourseById(req.params.courseId);
    const targetTrainer = await trainerData.getTrainerById(req.params.id);
    res.render('trainers/courseShow', {course: singleCourse, trainer: targetTrainer});
}));

router.delete('/:courseId', catchAsync (async(req, res) => {
    const { courseId } = req.params;
    const deleteCourse = await courseData.getCourseById(courseId);
    const courseTrainerId = deleteCourse.trainerId;
    await trainerData.removeCourseFromTrainer(courseTrainerId, courseId);
    // const courseMemberId = deleteCourse.memberId;
    // await memberData.removeCourseFromMember(courseMemberId, courseId);
    await courseData.removeCourse(courseId);
    res.redirect(`/fitclub/courses/trainers/${courseTrainerId}`);
}));

module.exports = router;