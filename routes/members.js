const express = require('express');
const router = express.Router();
const data = require('../data');
const memberData = data.members;
const trainerData = data.trainers;
const courseData = data.courses;
const commentData = data.comments;



router.get('/', async (req, res) => {
    
    try {
        const member = await memberData.getMemberById(req.session.user.id)
        res.render('members/speMember', {member: member})
    } catch (e) {
        res.status(404).json({ error: `members can not be found with that id` });
    }
})

router.get('/courses', async (req, res) => {
    try { 
        const member = await memberData.getMemberById(req.session.user.id)
        
        let courseInfo = []
        for(let n in member.coursesEnrolled ){
            course = await courseData.getCourseById(member.coursesEnrolled[n])
            console.log(course)
            courseInfo.push(course)
        }
        res.render('members/courses', {memberCourse: courseInfo})
    }catch(e){

    }
})

router.get('/coursesShow/:id', async (req, res) => {
    const course = await courseData.getCourseById(req.params.id)
    const trainer = await trainerData.getTrainerById(course.trainerId)
    const firstName = trainer.first_name
    const lastName = trainer.last_name
    const trainer_name = firstName+" "+lastName
    
    res.render('members/memberCourseShow', {course: course, trainer_name: trainer_name})

})

router.get('/schedule', async (req, res) => {
    const member = await memberData.getMemberById(req.session.user.id)
    const coursesEnrolled = member.coursesEnrolled
    let courseInfo = {};
    for(let i = 0; i < coursesEnrolled.length; i ++){
        courseInfo[i] = await courseData.getCourseById(coursesEnrolled[i]);
    }
    let monC = [], tueC = [], wenC = [], thuC = [], friC = [], satC = [], sunC = [];
    for(let i in courseInfo){
        if(courseInfo[i].day === 1){
            monC.push(courseInfo[i]);
        }else if(courseInfo[i].day === 2){
            tueC.push(courseInfo[i]);
        }else if(courseInfo[i].day === 3){
            wenC.push(courseInfo[i]);
        }else if(courseInfo[i].day === 4){
            thuC.push(courseInfo[i]);
        }else if(courseInfo[i].day === 5){
            friC.push(courseInfo[i]);
        }
        else if(courseInfo[i].day === 6){
            satC.push(courseInfo[i]);
        }else{
            sunC.push(courseInfo[i]);
        }
    }
    res.render('members/schedule', {
        title: `My Course Schedule`,
        MondayCourse: monC,
        TuesdayCourse: tueC,
        WednesdayCourse: wenC,
        ThursdayCourse: thuC,
        FridayCourse: friC,
        SaturdayCourse: satC,
        SundayCourse: sunC,
        member: member
    });
})


module.exports = router;