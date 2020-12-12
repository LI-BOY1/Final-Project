const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const data = require('../data');
const trainerData = data.trainers;
const memberData = data.members;
const courseData = data.courses;
const staticData = require('../data/staticData');
const img = 'https://source.unsplash.com/collection/483251';

// login username should be case in-sensitive

router.get('/', async(req, res) =>{
    //const trainerList = await trainerData.getAllTrainers();
    //const courseList = await courseData.getAllCourses();
    //const member = await memberData.getMemberById(req.params.id);


    const courseList = staticData.courseList;
    let courseNameList = new Set();

    for(let i = 0; i < courseList.length; i++){

        // let obj = courseList[i];
        // let courseName = obj["coursename"];

        let courseName = courseList[i];
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

                let newObject = {};
                newObject["_id"] = obj["_id"];
                newObject["first_name"] = obj["first_name"];
                newObject["last_name"] = obj["last_name"];
                newObject["course"] = myCourse;

                trainersArray.push(newObject);
                break;
            }
        }

    }

    // if no trainers for that course, display all trainers
    if(trainersArray.length == 0){
        for(let i = 0; i < trainerList.length; i++) {

            let obj = trainerList[i];
            let newObject = {};
            newObject["_id"] = obj["_id"];
            newObject["first_name"] = obj["first_name"];
            newObject["last_name"] = obj["last_name"];
            newObject["course"] = myCourse;

            trainersArray.push(newObject);
        }
    }

    res.render('enroll/enrollPageTrainers', {trainers: trainersArray, course: myCourse});

});



router.get('/courseschedule/:id/:course', async (req, res) => {

    const courseEnroll = req.params.course;
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
    }

    res.render('enroll/enrollCoursePage', {
        title: `${trainer.first_name} ${trainer.last_name}'s Course Schedule`,
        MondayCourse: monC,
        TuesdayCourse: tueC,
        WednesdayCourse: wenC,
        ThursdayCourse: thuC,
        FridayCourse: friC,
        trainer: trainer,
        course: courseEnroll,
        trainerName: `${trainer.first_name} ${trainer.last_name}`
    });
});



router.get('/enrollCourse/:trainerId/:courseName/:day/:time', async (req, res) => {

    let trainerId = req.params.trainerId;
    let courseName = req.params.courseName;
    let day = req.params.day;
    let time = req.params.time;

    console.log(day);
    console.log(time);
    console.log(trainerId);
    console.log(courseName);
    console.log(req.session.user);

    let memberId = req.session.user.id;

    let numDay = 0;

    if(day == 'Monday'){
        numDay = 1;
    }else if(day == 'Tuesday'){
        numDay = 2;
    }else if(day == 'Wednesday'){
        numDay = 3;
    }else if(day == 'Thursday'){
        numDay = 4;
    }else
        numDay = 5;

    const trainerObj = await trainerData.getTrainerById(trainerId);
    const memberObj = await memberData.getMemberById(memberId);
    // console.log(trainerObj);

    // check if time conflicts
    let conflict = false;
    let array = trainerObj["course"];
    for(let i = 0; i < array.length; i++){
        let cId = array[i];
        const cEnrolled = await courseData.getCourseById(cId);

        if(numDay == cEnrolled["day"] && parseInt(time) == cEnrolled["start_time"]){
            conflict = true;
            break;
        }
    }

    array = memberObj["coursesEnrolled"];
    for(let i = 0; i < array.length; i++){
        let cId = array[i];
        const cEnrolled = await courseData.getCourseById(cId);

        if(numDay == cEnrolled["day"] && parseInt(time) == cEnrolled["start_time"]){
            conflict = true;
            break;
        }
    }


    if(conflict){
        let data = {info: 'get it', error: true};
        res.json(data);
    }else{


        //courseData.addCourse: create course object and inserted into course collection
        //courseData.addTAccIdToCourse: 把 以 courseId 为 id 的那个course的 trainerActId 设置为trainerActId

        const obj = staticData["courseInfo"];
        const courseInfo = obj[courseName];
        const course = await courseData.addCourse(courseName, courseInfo["description"], img, courseInfo["price"], parseInt(time), numDay, trainerId);

        // console.log("this: " + course._id);
        // console.log("this: " + trainerObj.trainerAcId);
        await courseData.addTAccIdToCourse(course._id, trainerObj.trainerAcId);

        // trainerData.addCourseToTrainer: 把 courseId 加到 以trainerId为id的那个trainer的course array 里
        await trainerData.addCourseToTrainer(trainerId, course._id);



        // console.log("member_1 select course_1 with trainer_1");

        // 把以这个memberId的为Id的 member的 course array 加上这门课的id
        await memberData.addCourseToMember(memberId, course._id);

        // 把这门课的memberId 变为 这个member的Id
        await courseData.addMemberToCourse(course._id, memberId);

        // 把这个 trainer的members array 加上这个memberid
        await trainerData.addMemberToTrainer(trainerId, memberId);

        // 把这个 member的trainers array 加上这个trainerid
        await memberData.addTrainerToMember(memberId, trainerId);


        // id is the member id
        // { id: '5fd28c6fb49ffb350a541482',
        //     username: 'GoodGirl',
        //     isTrainer: false }

        let data = {info: 'get it'};

        res.json(data);

    }


});




module.exports = router;