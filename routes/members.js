const express = require('express');
const router = express.Router();
const data = require('../data');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const memberData = data.members;
const trainerData = data.trainers;
const courseData = data.courses;
const commentData = data.comments;


router.get('/', catchAsync(async(req, res) => {
    const starTrainers = await trainerData.getTopThreeTrainers();
    res.render('home', {trainer: starTrainers});
}));

router.get('/register', catchAsync(async(req, res) => {
    res.render('users/register');
}));



router.post('/register', catchAsync(async(req, res) => {
    const {username, email, first_name, last_name, address, phone, password} = req.body;
    if(!username || username.trim().length === 0){
        req.flash('error', 'Please input your username!');
        res.redirect('/register');
        return ;
    }
    if(!email || email.trim().length === 0){
        req.flash('error', 'Please input your email!');
        res.redirect('/register');
        return ;
    }
    if(!first_name || first_name.trim().length === 0){
        req.flash('error', 'Please input your first_name!');
        res.redirect('/register');
        return ;
    }
    if(!last_name || last_name.trim().length === 0){
        req.flash('error', 'Please input your last_name!');
        res.redirect('/register');
        return ;
    }
    if(!address || address.trim().length === 0){
        req.flash('error', 'Please input your address!');
        res.redirect('/register');
        return ;
    }
    if(!phone || phone.trim().length === 0){
        req.flash('error', 'Please input your phone number!');
        res.redirect('/register');
        return ;
    }
    if(!password){
        req.flash('error', 'Please input your password!');
        res.redirect('/register');
        return ;
    }
    if(password.length < 3){
        req.flash('error', 'Password length must be greater than 3!');
        res.redirect('/register');
        return ;
    }
    let phoneNumber = parseInt(phone);
    if(phoneNumber !== Number(phone)){
        req.flash('error', 'Your phone number is invalid!');
        return res.redirect('/register');
    }
    try{
        const members = await memberData.getAllMembers();
        for(let i = 0; i < members.length; i ++){
            if(members[i].username === username){
                req.flash('error', 'This username has already been used!');
                return res.redirect('/register');
            }
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const member = await memberData.addMember(first_name, last_name, phone, email, address, username, hashedPassword);
        req.session.user = {
            id: member._id,
            username: username,
            isTrainer: false
        };
        req.flash('success','Welcome to Fitness Club');
        res.redirect('/');
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));



router.post('/login', catchAsync(async(req, res) => {
    const {username, password} = req.body;

    if(!username || username.trim().length === 0){
        req.flash('error', 'Please input your username!');
        res.redirect('/login');
        return ;
    }
    if(!password){
        req.flash('error', 'Please input your password!');
        res.redirect('/login');
        return ;
    }
    
    const members = await memberData.getAllMembers();
    let targetUser = null;
    let match = false;
    for(let i = 0; i < members.length; i ++){
        if(members[i].username === username){
            targetUser = members[i];
            match = await bcrypt.compare(password, targetUser.password);
            break;
        }
    }

    if(targetUser && match){
        req.session.user = {
            id: targetUser._id,
            username: targetUser.username,
            isTrainer: targetUser.isTrainer
        }
        req.flash('success', 'Welcome back!');
        // const redirectUrl = req.session.returnTo || '/';
        // console.log(`redirectUrl in login: ${redirectUrl}`);
        // delete req.session.returnTo;
        res.redirect('/');
    }else{
        req.flash('error', 'Your password or username is not true!');
        res.redirect('/login');
    }
}));


router.get('/logout', catchAsync(async(req, res) => {
    // req.session.destroy();
    req.session.user = null;
    req.flash('success', "Goodbye!");
    res.redirect('/');
}));


router.get('/login', catchAsync(async(req, res) => {
    res.render('users/login');
}));

module.exports = router;
