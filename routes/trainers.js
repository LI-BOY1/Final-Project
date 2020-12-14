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
        const temp =  await commentData.getCommentById(trainerComList[i]);
        commentForThatTrainer[i] = temp;
    }
    // const commentMember = await memberData.getMemberById(commentForThatTrainer.memberId);
    // if(!oneTrainer){
    //     req.flash('error', 'Cannot find that trainer!');
    //     return res.redirect('/fitclub/trainers');
    // }
    res.render('trainers/show', {trainer: oneTrainer, comment: commentForThatTrainer});
}));

router.get('/courseschedule/:id', catchAsync (async (req, res) => {
    const trainer = await trainerData.getTrainerById(req.params.id);
    const courseIdList = trainer.course;
    const courseInfo = {};
    for(let i = 0; i < courseIdList.length; i ++){
        courseInfo[i] = await courseData.getCourseById(courseIdList[i]);
    }
    let monC = [], tueC = [], wenC = [], thuC = [], friC = [];
    for(let i in courseInfo){
        if(courseInfo[i].day === 1){
            monC.push(courseInfo[i]);
        }else if(courseInfo[i].day === 2){
            tueC.push(courseInfo[i]);
        }else if(courseInfo[i].day === 3){
            wenC.push(courseInfo[i]);
        }else if(courseInfo[i].day === 4){
            thuC.push(courseInfo[i]);
        }else{
            friC.push(courseInfo[i]);
        }
        monC.sort((a, b) =>{
            return a.start_time - b.start_time;
        });
        tueC.sort((a, b) =>{
            return a.start_time - b.start_time;
        });
        wenC.sort((a, b) =>{
            return a.start_time - b.start_time;
        });
        thuC.sort((a, b) =>{
            return a.start_time - b.start_time;
        });
        friC.sort((a, b) =>{
            return a.start_time - b.start_time;
        });
    }
    res.render('trainers/schedule', {
        title: `${trainer.first_name} ${trainer.last_name}'s Course Schedule`,
        MondayCourse: monC,
        TuesdayCourse: tueC,
        WednesdayCourse: wenC,
        ThursdayCourse: thuC,
        FridayCourse: friC,
        trainer: trainer
    });
}));
// router.get('/:id/edit', catchAsync (async (req, res) => {
//     const oneTrainer = await trainerData.getTrainerById(req.params.id);
//     res.render('trainers/edit', {trainer: oneTrainer});
// }));


module.exports = router;