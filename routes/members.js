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




module.exports = router;