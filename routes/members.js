const express = require('express');
const router = express.Router();
const data = require('../data');
const memberData = data.members;
const trainerData = data.trainers;
const courseData = data.courses;
const commentData = data.comments;

router.get("/", async (req, res) => {
    const memberList = await memberData.getAllMembers();
    res.render('members/member', {member: memberList});
})


router.get('/:id', async (req, res) => {
    try {
        const member = await memberData.getMemberById(req.params.id)
        res.render('members/speMember', {member: member})
    } catch (e) {
        res.status(404).json({ error: `members can not be found with that id` });
    }
})

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

})


module.exports = router;
