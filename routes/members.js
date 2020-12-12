const express = require('express');
const router = express.Router();
const data = require('../data');
const memberData = data.members;
const trainerData = data.trainers;
const courseData = data.courses;
const commentData = data.comments;



router.get('/:id', async (req, res) => {
    try {
        const member = await memberData.getMemberById(req.params.id)
        res.render('members/speMember', {member: member})
    } catch (e) {
        res.status(404).json({ error: `members can not be found with that id` });
    }
});

router.get('/courses/:id', async (req, res) => {
    try {
        const member = await memberData.getMemberById(req.params.id)
        let courseInfo = []
        for(let n in member.coursesEnrolled ){
            course = await courseData.getCourseById(member.coursesEnrolled[n])
            console.log(course)
            courseInfo.push(course)
        }
        res.render('members/courses', {memberCourse: courseInfo})
    }catch(e){

    }

});


// 利用 星期几和时间来锁定一门课
router.post('/delete/', async(req, res) => {

    let {Day, Time} = req.body;
    let memberId = req.session.user.id;
    let member = await memberData.getMemberById(memberId);
    let list = member["coursesEnrolled"];

    let day = parseInt(Day);
    let time = parseInt(Time);
    let targetCourse = null;

    // 对于这个member，要知道他上过的所有course有哪些trainer，并且上了各自trainer的几门课
    let memberToTrainer = new Map();

    for(let i = 0; i < list.length; i++){

        let courseId = list[i];
        let course = await courseData.getCourseById(courseId);






        if(course["day"] == day && course["start_time"] == time){
            targetCourse = course;
        }
    }

    if(!targetCourse){



    }else{
        // find the course we need to delete !!
        let trainerId = targetCourse["trainerId"];
        let trainer  = await trainerData.getTrainerById(trainerId);






        // //courseData.addCourse: create course object and inserted into course collection
        // const course = await courseData.addCourse(courseName, "This course is good for increasing muscle!", img, 290, parseInt(time), numDay, trainerId);
        //
        //

        // //courseData.addTAccIdToCourse: 把 以 courseId 为 id 的那个course的 trainerActId 设置为trainerActId
        // await courseData.addTAccIdToCourse(course._id, trainerObj.trainerAcId);
        //


        // // trainerData.addCourseToTrainer: 把 courseId 加到 以trainerId为id的那个trainer的course array 里
        // await trainerData.addCourseToTrainer(trainerId, course._id);
        //

        //
        // // 把以这个memberId的为Id的 member的 course array 加上这门课的id
        // await memberData.addCourseToMember(memberId, course._id);
        //



        // // 把这门课的memberId 变为 这个member的Id
        // await courseData.addMemberToCourse(course._id, memberId);
        //




        // // 把这个 trainer的members array 加上这个memberid
        // await trainerData.addMemberToTrainer(trainerId, memberId);
        //
        // // 把这个 member的trainers array 加上这个trainerid
        // await memberData.addTrainerToMember(memberId, trainerId);






    }



});





module.exports = router;