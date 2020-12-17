// const express = require('express');
// const router = express.Router();
// const data = require('../data');
// const memberData = data.members;
// const trainerData = data.trainers;
// const courseData = data.courses;
// const commentData = data.comments;
// const xss = require('xss');
//
// router.get('/memberInfo/:id', async (req, res) => {
//
//     res.render('members/editMember', {memberId: req.params.id})
// })
//
// router.post('/memberInfo/:id', async (req, res) => {
//     let updateMember = {
//         first_name: xss(req.body.FirstName)
//     }
//     const member = await memberData.update(req.params.id, updateMember)
//
//
// })
//
// module.exports = router;