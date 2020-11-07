const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const data = require('../data');
const trainerData = data.trainers;
const memberData = data.members;
const courseData = data.courses;
const commentData = data.comments;


router.get('/:id', async (req, res)=>{

    try{
    const oneTrainer = await trainerData.getTrainerById(req.params.id);
    res.render('train/trainer', {trainer: oneTrainer});
    }catch(e){
        res.status(404).render('train/trainer', {
            errorId: req.params.id,
            hasIdError: true
          });
    }
});

