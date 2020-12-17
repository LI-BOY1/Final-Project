const express = require('express');
const router = express.Router();
const data = require('../data');
const memberData = data.members;
const trainerData = data.trainers;
const courseData = data.courses;
const commentData = data.comments;


router.get('/profile', async (req, res) => {
    try {
        let memberId = req.session.user.id;
        const member = await memberData.getMemberById(memberId);
        res.render('members/speMember', {member: member})
    } catch (e) {
        res.status(404).json({ error: `members can not be found with that id` });
    }
});

router.get('/courses', async (req, res) => {
    try {
        const member = await memberData.getMemberById(req.session.user.id);

        let courseInfo = [];
        for(let n in member.coursesEnrolled ){
            course = await courseData.getCourseById(member.coursesEnrolled[n]);
            console.log(course);
            courseInfo.push(course);
        }
        res.render('members/courses', {memberCourse: courseInfo})
    }catch(e){

    }
});


router.get('/coursesShow/:id', async (req, res) => {
    const course = await courseData.getCourseById(req.params.id);
    const trainer = await trainerData.getTrainerById(course.trainerId);
    const firstName = trainer.first_name;
    const lastName = trainer.last_name;
    const trainer_name = firstName+" "+lastName;

    res.render('members/memberCourseShow', {course: course, trainer_name: trainer_name})

});


router.get('/schedule', async (req, res) => {

    let memberId = req.session.user.id;
    const member = await memberData.getMemberById(memberId);

    let result = await createObj(member);
    result["member"] = member;

    res.render('members/schedule', result);


});


// 利用 星期几和时间来锁定一门课
router.post('/delete/:cancelTime/:cancelDay', async(req, res) => {

    let cancelDay = req.params.cancelDay;
    let cancelTime = req.params.cancelTime;

    let memberId = req.session.user.id;
    let member = await memberData.getMemberById(memberId);
    let list = member["coursesEnrolled"];

    let day = parseInt(cancelDay);
    let time = parseInt(cancelTime);
    let targetCourse = null;

    // 对于这个member，要知道他上过的所有course有哪些trainer，并且上了各自trainer的几门课
    let trainerFreq = {};

    for(let i = 0; i < list.length; i++){

        let courseId = list[i];
        let course = await courseData.getCourseById(courseId);

        // 对于每一门课，统计trainer的出现频率
        let tId = course["trainerId"];
        if(!trainerFreq[tId]){
            trainerFreq[tId] = 1;
        }else{
            trainerFreq[tId] = trainerFreq[tId] + 1;
        }

        if(course["day"] == day && course["start_time"] == time){
            targetCourse = course;
        }
    }


    console.log(trainerFreq);
    console.log(day + "   " + time);


    // find the course we need to delete !!
    let trainerId = targetCourse["trainerId"];
    let trainer  = await trainerData.getTrainerById(trainerId);
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

    if(trainerFreq[trainerId] == 1){
        try{
            await trainerData.deleteMember(trainerId, memberId);
            await memberData.deleteTrainer(memberId, trainerId);
        }catch (e){
            throw e;
        }
    }

    member = await memberData.getMemberById(memberId);
    let result = await createObj(member);
    result["member"] = member;
    res.render('members/schedule', result);





});


async function createObj(member) {


    const courseIdList = member.coursesEnrolled;
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


    res["title"] = `${member.first_name} ${member.last_name}'s Course Schedule`;
    res["MondayCourse"] = monC;
    res["TuesdayCourse"] = tueC;
    res["WednesdayCourse"] = wenC;
    res["ThursdayCourse"] =  thuC;
    res["FridayCourse"] = friC;

    return res;

}






module.exports = router;