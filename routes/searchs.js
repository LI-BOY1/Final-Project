const express = require('express');
const router = express.Router();
const data = require('../data');
const trainerData = data.trainers;
const courseData = data.courses;
const staticData = require('../data/staticData');

// login username should be case in-sensitive

router.post('/trainers', async(req, res) =>{


    // console.log(req.body);
    // { searchTrainer: 'sd' }
    //

    let tt = req.body.searchTrainer;
    let target = tt.toLowerCase().trim();
    const trainerList = await trainerData.getAllTrainers();
    let array = [];

    for(let i = 0; i < trainerList.length; i++){

        let obj = trainerList[i];
        let firstName = obj["first_name"].toLowerCase();
        let lastName = obj["last_name"].toLowerCase();

        if(firstName == target || lastName == target){
            array.push(obj);
            continue;
        }

        let a = firstName + " " + lastName;
        let b = lastName + " " + firstName;

        if(a == target || b == target){
            array.push(obj);
            continue;
        }
    }

    console.log(array);

    const starTrainers = await trainerData.getTopThreeTrainers();
    //res.render('home', {trainer: starTrainers});


    let result = true;
    let error = false;
    if(array.length == 0) {
        result = false;
        error = true;
    }

    res.render('home', {searchList: array, trainer: starTrainers, trainerSearchResult: result, hasErrorTrainer: error, startTrainerZero: starTrainers.length != 0});


});


router.post('/courses', async(req, res) =>{


    // console.log(req.body);
    // { searchCourse: 'course' }

    let cc = req.body.searchCourse;
    let target = cc.toLowerCase();
    let allCourseName = staticData.courseList;
    let found = false;
    const starTrainers = await trainerData.getTopThreeTrainers();

    for(let i = 0; i < allCourseName.length; i++){

        if(target == allCourseName[i]){
            found = true;
            break;
        }
    }

    // you search some course not provided
    if(!found) {
        res.render('home', {searchList: [], trainer: starTrainers, courseSeachResult: false, hasErrorCourse: true, startTrainerZero: starTrainers.length != 0});
        return;
    }

    const courseList = await courseData.getAllCourses();
    // console.log("!!!!!!!!!!!!");

    let trainerSet = new Set();
    let array = [];

    for(let i = 0; i < courseList.length; i++){

        let obj = courseList[i];
        let courseName = obj["coursename"];

        if(courseName.includes("_")){
            let pos = courseName.indexOf("_");
            courseName = courseName.substring(0, pos);
        }

        if(target == courseName){
            let id = obj["trainerId"];
            let trainer = await trainerData.getTrainerById(id);

            if(trainerSet.has(trainer["_id"]))
                continue;

            trainerSet.add(trainer["_id"]);
            array.push(trainer);
        }
    }

    //console.log(courseNameList);

    //courseNameList.forEach(el => array.push(el));

    //res.render('enroll/enrollPageCourses', {trainers: array});


    // console.log(array);


    // 说明没有 trainer在上这门课, 把所有trainer 扔回前端
    if(array.length == 0){
        let trainerList = await trainerData.getAllTrainers();
        array = trainerList;

        let result = true;
        let error = false;
        if(array.length == 0) {
            // 如果没人上这门课并且没有 一个 trainer 存在，
            result = false;
            error = true;
            res.render('home', {searchList: array, trainer: starTrainers, courseSeachResult: result, hasErrorCourse: error, startTrainerZero: starTrainers.length != 0});
        }else{
            // 如果没人上这门课，返回所有的trainer
            //console.log(starTrainers.length);
            res.render('home', {searchList: array, trainer: starTrainers, courseSeachResult: result, hasErrorCourse: error,isAllTrainers: true, startTrainerZero: starTrainers.length != 0});
        }

        return;

    }

    // 如果有 trainer 上这门课
    console.log("!!!!!!!!!!!!");
    //res.render('home', {searchList: array, trainer: starTrainers, courseSeachResult: true, hasErrorCourse: false, isAllTrainers: true, startTrainerZero: starTrainers.length != 0});
    res.render('home', {searchList: array, trainer: starTrainers, courseSeachResult: true, hasErrorCourse: false, startTrainerZero: starTrainers.length != 0})


});






module.exports = router;