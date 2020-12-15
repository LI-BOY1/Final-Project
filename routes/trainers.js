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


    if(trainerComList.length == 0){
        //console.log("!!!!!!!!!");
        res.render('trainers/show', {trainer: oneTrainer, comment: []});
        return;
    }

    let commentForThatTrainer = [];
    for(let i = 0; i < trainerComList.length; i ++){
        const temp =  await commentData.getCommentById(trainerComList[i]);
        commentForThatTrainer[i] = temp;
    }

    res.render('trainers/show', {trainer: oneTrainer, comment: commentForThatTrainer});
}));

router.get('/courseschedule/:id', catchAsync (async (req, res) => {
    const trainer = await trainerData.getTrainerById(req.params.id);

    let result = await createObj(trainer);

    res.render('trainers/schedule', result);
}));


// 利用 星期几和时间来锁定一门课
router.post('/delete/:id/:cancelTime/:cancelDay', async(req, res) => {

    let cancelDay = req.params.cancelDay;
    let cancelTime = req.params.cancelTime;
    let trainerId = req.params.id;

    let trainer = await trainerData.getTrainerById(trainerId);
    let list = trainer["course"];

    let day = parseInt(cancelDay);
    let time = parseInt(cancelTime);
    let targetCourse = null;

    let memberFreq = {};

    for(let i = 0; i < list.length; i++){

        let courseId = list[i];
        let course = await courseData.getCourseById(courseId);

        // 对于每一门课，统计trainer的出现频率
        let mId = course["memberId"];
        if(!memberFreq[mId]){
            memberFreq[mId] = 1;
        }else{
            memberFreq[mId] = memberFreq[mId] + 1;
        }

        if(course["day"] == day && course["start_time"] == time){
            targetCourse = course;
        }
    }

    // console.log(memberFreq);
    // console.log(day + "   " + time);


    // find the course we need to delete !!
    let memberId = targetCourse["memberId"];
    let courseId = targetCourse["_id"];

    //delete course from course db
    try {
        await courseData.deleteCourseById(courseId);
    }catch (e) {
        throw e;
    }

    // delete course id from trainer course array
    try{
        await trainerData.deleteCourseFromTrainer(trainerId, courseId);
    }catch (e){
        throw e;
    }

    // delete course id from member coursesEnrolled array
    await memberData.deleteCourseFromMember(memberId, courseId);

    // 如果member只上了这个trainer的一门课，那么互相删除id
    if(memberFreq[memberId] == 1){
        try{
            await trainerData.deleteMember(trainerId, memberId);
            await memberData.deleteTrainer(memberId, trainerId);
        }catch (e){
            throw e;
        }
    }

    trainer = await trainerData.getTrainerById(trainerId);
    let result = await createObj(trainer);
    res.render('trainers/schedule', result);

});



async function createObj(trainer) {

    const courseIdList = trainer.course;
    const courseInfo = {};
    let res = {};


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
    }

    res["title"] = `${trainer.first_name} ${trainer.last_name}'s Course Schedule`;
    res["MondayCourse"] = monC;
    res["TuesdayCourse"] = tueC;
    res["WednesdayCourse"] = wenC;
    res["ThursdayCourse"] = thuC;
    res["FridayCourse"] = friC;
    res["trainer"] = trainer;

    return res;

}



module.exports = router;