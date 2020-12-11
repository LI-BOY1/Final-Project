const express = require('express');
const router = express.Router();
const data = require('../data');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const memberData = data.members;
const trainerData = data.trainers;
const courseData = data.courses;
const commentData = data.comments;
const img = 'https://source.unsplash.com/collection/483251';

// login and register should be case sensitive

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

        if(req.body.role == 'member'){

            const member = await memberData.addMember(first_name, last_name, phone, email, address, username, hashedPassword);
            req.session.user = {
                id: member._id,
                username: username,
                isTrainer: false
            };

        }else{

            // this is a trainer register
            const trainer = await trainerData.addTrainer(first_name, last_name, "am trainer", phone, email, address, username, hashedPassword, img);
            const trainerAcc_1 = await memberData.addMember(first_name, last_name, phone, email, address, username, hashedPassword);
            await memberData.markMemberAsTrainer(trainerAcc_1._id);
            await memberData.addTRegisterIdToTrianer(trainerAcc_1._id, trainer._id);

            req.session.user = {
                id: trainerAcc_1._id,
                username: username,
                isTrainer: true
            };
        }

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

            if( (req.body.role === 'member' && members[i].isTrainer === false) || ( req.body.role === 'trainer' && members[i].isTrainer === true ) ){

                targetUser = members[i];
                match = await bcrypt.compare(password, targetUser.password);
                break;
            }
        }
    }

    if(targetUser && match){
        req.session.user = {
            id: targetUser._id,
            username: targetUser.username,
            isTrainer: targetUser.isTrainer
        };

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
