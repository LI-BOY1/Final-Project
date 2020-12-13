const express = require('express');
const router = express.Router();
const data = require('../data');
const memberData = data.members;
const trainerData = data.trainers;
const courseData = data.courses;
const commentData = data.comments;

router.get('/memberInfo', async (req, res) => {
    
    res.render('members/editMember', {memberId: req.session.user.id})
})

router.post('/memberInfo', async (req, res) => {
    let updateMember = {
        first_name: req.body.FirstName,
        last_name: req.body.LastName,
        phone: req.body.Phone,
        email: req.body.Email,
        address: req.body.Address
    }
    const member = await memberData.update(req.session.user.id, updateMember)
    res.render('members/speMember', {member: member})
})

module.exports = router;