const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const data = require('../data');
const trainerData = data.trainers;
const memberData = data.members;
const courseData = data.courses;

// login username should be case in-sensitive

router.get('/', async(req, res) =>{
    //const trainerList = await trainerData.getAllTrainers();
    const courseList = await courseData.getAllCourses();
    //const member = await memberData.getMemberById(req.params.id);

    let courseNameList = new Set();

    for(let i = 0; i < courseList.length; i++){

        let obj = courseList[i];
        let courseName = obj["coursename"];

        if(courseName.includes("_")){
            let pos = courseName.indexOf("_");
            courseName = courseName.substring(0, pos);
        }

        courseNameList.add(courseName.toLowerCase());
    }

    //console.log(courseNameList);
    let array = [];
    courseNameList.forEach(el => array.push(el));

    res.render('enroll/enrollPageCourses', {courses: array});

});


router.get('/find/:course', async(req, res) =>{

    const myCourse = req.params.course;
    const trainerList = await trainerData.getAllTrainers();
    let trainersArray = [];

    for(let i = 0; i < trainerList.length; i++){

        let obj = trainerList[i];
        let courseArray = obj["course"];

        for(let j = 0; j < courseArray.length; j++){

            let course = await courseData.getCourseById(courseArray[j]);

            if(course["coursename"].toLowerCase().includes(myCourse)) {
                trainersArray.push(obj);
                break;
            }
        }

    }

    res.render('enroll/enrollPageTrainers', {trainers: trainersArray, course: myCourse});

});







// router.get('/', catchAsync (async(req, res) => {
//     const trainerList = await trainerData.getAllTrainers();
//     res.render('trainers/index', {trainer: trainerList});
// }));
//
// router.get('/:id', catchAsync (async (req, res)=>{
//     const oneTrainer = await trainerData.getTrainerById(req.params.id);
//     const trainerComList = oneTrainer.comment;
//     let commentForThatTrainer = [];
//     for(let i = 0; i < trainerComList.length; i ++){
//         commentForThatTrainer[i] = await commentData.getCommentById(trainerComList[i]);
//     }
//     // if(!oneTrainer){
//     //     req.flash('error', 'Cannot find that trainer!');
//     //     return res.redirect('/fitclub/trainers');
//     // }
//     res.render('trainers/show', {trainer: oneTrainer, comment: commentForThatTrainer});
// }));
//
// router.get('/courseschedule/:id', async (req, res) => {
//     const trainer = await trainerData.getTrainerById(req.params.id);
//     const courseIdList = trainer.course;
//     const courseInfo = {};
//     for(let i = 0; i < courseIdList.length; i ++){
//         courseInfo[i] = await courseData.getCourseById(courseIdList[i]);
//     }
//     let monC = [], tueC = [], wenC = [], thuC = [], friC = [];
//     for(let i in courseInfo){
//         if(courseInfo[i].day === 1){
//             monC.push(courseInfo[i]);
//         }else if(courseInfo[i].day === 2){
//             tueC.push(courseInfo[i]);
//         }else if(courseInfo[i].day === 3){
//             wenC.push(courseInfo[i]);
//         }else if(courseInfo[i].day === 4){
//             thuC.push(courseInfo[i]);
//         }else{
//             friC.push(courseInfo[i]);
//         }
//     }
//     res.render('trainers/schedule', {
//         title: `${trainer.first_name} ${trainer.last_name}'s Course Schedule`,
//         MondayCourse: monC,
//         TuesdayCourse: tueC,
//         WednesdayCourse: wenC,
//         ThursdayCourse: thuC,
//         FridayCourse: friC,
//         trainer: trainer
//     });
// });


module.exports = router;