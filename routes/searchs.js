const express = require('express');
const router = express.Router();
const data = require('../data');
const trainerData = data.trainers;
const courseData = data.courses;

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

    res.render('home', {searchList: array, trainer: starTrainers, trainerSearchResult: result, hasErrorTrainer: error});


});


router.post('/courses', async(req, res) =>{


    // console.log(req.body);
    // { searchCourse: 'course' }

    let cc = req.body.searchCourse;
    let target = cc.toLowerCase();
    const courseList = await courseData.getAllCourses();

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


    console.log(array);


    const starTrainers = await trainerData.getTopThreeTrainers();
    //res.render('home', {trainer: starTrainers});

    let result = true;
    let error = false;
    if(array.length == 0) {
        result = false;
        error = true;
    }

    res.render('home', {searchList: array, trainer: starTrainers, courseSeachResult: result, hasErrorCourse: error});

});






module.exports = router;