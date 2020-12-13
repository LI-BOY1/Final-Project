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
    const trainer_username = trainer.username
    
    res.render('members/memberCourseShow', {course: course, trainer_username: trainer_username})

})


module.exports = router;