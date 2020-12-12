const express = require('express');
const router = express.Router();
const data = require('../data');
const memberData = data.members;
const trainerData = data.trainers;
const courseData = data.courses;
const commentData = data.comments;

router.get('/memberInfo/:id', async (req, res) => {
    
    res.render('members/editMember', {memberId: req.params.id})
})

router.post('/memberInfo/:id', async (req, res) => {
    let updateMember = {
        first_name: req.body.FirstName,
        last_name: req.body.LastName,
        age: req.body.Age,
        phone: req.body.Phone,
        email: req.body.Email,
        address: req.body.Address,
        zipcode:  req.body.Zipcode

    }
    const member = await memberData.update(req.params.id, updateMember)
    res.render('members/speMember', {member: member})
})

module.exports = router;