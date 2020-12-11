const trainerRoutes = require('./trainers');
const commentRoutes = require('./comments');
const courseRoutes = require('./courses');
const ExpressError = require('../utils/ExpressError');
const path = require('path');
const express = require("express");
const session = require('express-session');
const loginRoutes = require("./login");
const xss = require("xss");
const router = express.Router();
const saltRounds = 16;
const memberData = require("../data/members.js");
const trainerData = require("../data/trainers.js");
const courseData = require("../data/courses.js");
const commentData = require("../data/comments.js");

const constructorMethod = (app) => {

    app.use(session({
        name: 'AuthCookie',
        secret: 'some secret string!',
        resave: false,
        saveUninitialized: true
    }));

    app.use(function(req, res, next) {
        let date = new Date().toUTCString();
        let method = req.method;
        let route = req.originalUrl;
        let authent = (req.session.authent)? "(Authenticated User)" : "(Non-authenticated User)";
        if(!(route.includes(".css"))&&!(route.includes(".js"))&&!(route.includes(".ico"))){
            console.log(`${date} ${method} ${route} ${authent}`);
        }
        next();
    });

    app.use('/fitclub/trainers', trainerRoutes);
    app.use('/fitclub/courses', courseRoutes);
    app.use('/fitclub/trainers/:id/comments', commentRoutes);
    app.use("/login", loginRoutes);
    app.use("/", router);

    router.get("/", async(req, res) => {

            try{
                const topTrainer = await trainerData.getTopTrainer();
                const latestReview = await commentData.getAllComments();

                res.render("home", { verified: false,trainer:topTrainer,com1:latestReview[0],com2:latestReview[1],com3:latestReview[2],currentUser:xss(req.session.authent)});


            } catch(e) {
                res.status(400);
            }

    });


    router.get("/admin", async(req, res) => {

        try{
            res.render("admin", { verified: false,currentUser:xss(req.session.authent)});

        } catch(e) {
            res.status(400);
        }

    });

    router.get("/memberAdmin", async(req, res) => {

        try{
            res.render("memberAdmin", { verified: false,currentUser:xss(req.session.authent)});

        } catch(e) {
            res.status(400);
        }

    });

    router.get("/alltrainers", async(req, res) => {

        try{
            const all = await trainerData.getAllTrainers();
            res.render("trainers/index", { verified: false,trainer:all,currentUser:xss(req.session.authent)});
        } catch(e) {
            res.status(400);
        }

    });


    router.get("/allcourses", async(req, res) => {

        try{
            const all = await courseData.getAllCourses();
            res.render("result", { verified: false,course:all,currentUser:xss(req.session.authent)});
        } catch(e) {
            res.status(400);
        }

    });



    router.get("/signup", (req,res) => {
        if(xss(!req.session.authent)) {
            res.render("./signup",{verified: false, title: "RMC | Account Creation",currentUser:xss(req.session.authent)});
        } else {
            res.redirect("/profile");
        }
    });

    app.get('/signin', (req, res) => {
        res.render('login',{currentUser:xss(req.session.authent)});
    });



    app.all('*', (req, res, next) => {
        next(new ExpressError('Page Not Found', 404));
    })

    app.use((err, req, res, next) => {
        const {statusCode = 500} = err;
        if(!err.message) err.message = 'Oh No, Something Went Wrong!';
        res.status(statusCode).render('error', {err});
    });
  };

router.get("/logout", (req,res) => {
    if(xss(req.session.authent)){
        req.session.destroy();
        res.redirect("/");
    } else {
        res.redirect("/");
    }
});
router.get("/profile", async(req,res) => {
    if(xss(req.session.authent)){
        try {
            let info = await memberData.getMemberById(req.session.user.toString());
            if(!info) info = await trainerData.getTrainerById(req.session.user.toString());

            res.render("profile",{verified: true, user: info,currentUser:xss(req.session.authent)});

        } catch(e){
            console.log(e);
            res.render("error",{verified: true,currentUser:xss(req.session.authent)});
        }
    } else {
        req.session.login_fail = true;
        res.redirect("/login");
    }
});
router.get("/search",async (req,res)=>{
        const courseCollection = await courseData.getAllCourses();
        const topTrainer = await trainerData.getTopTrainer();
        const courses = [];
        for(let i = 0; i < courseCollection.length; i++){
            let cn = courseCollection[i].trainerId;
            let foundCourse = false;

            foundCourse = cn == topTrainer._id ;

            if(foundCourse){
                courses.push(courseCollection[i]);
            }
        }
        if(courses.length == 0){
            res.status(404).render("result", {
                trainers: "No course with that name",currentUser:xss(req.session.authent)
            });
        }
        else{
            res.status(200).render("result", {
                course: courses,currentUser:xss(req.session.authent)
            });
        }

});

router.post("/search", async (req, res) => {


    try{
        let body = xss(req.body.searchInput);
        body = body.toLowerCase();

        if(req.body.searchtype=="name"){
        const courseCollection = await courseData.getAllCourses();

        const courses = [];
        for(let i = 0; i < courseCollection.length; i++){
            let cn = courseCollection[i].coursename.toLowerCase();
            let foundCourse = false;

            foundCourse = cn.includes(body) ;

            if(foundCourse){
                courses.push(courseCollection[i]);
            }
        }
        if(courses.length == 0){
            res.status(404).render("result", {
                trainers: "No course with that name",currentUser:xss(req.session.authent)
            });
        }
        else{
            res.status(200).render("result", {
                course: courses,currentUser:xss(req.session.authent)
            });
        }}
        else{
            const trainerCollection = await trainerData.getAllTrainers();
            const trainers = [];
            for(let i = 0; i < trainerCollection.length; i++){
                let fn = trainerCollection[i].first_name.toLowerCase();
                let ln = trainerCollection[i].last_name.toLowerCase();

                let found = false;
                found = fn.includes(body) || ln.includes(body) ;
                if(found){
                    trainers.push(trainerCollection[i]);
                }
            }
            if(trainers.length == 0){
                res.status(404).render("error", {
                    error: "No trainer with that name",currentUser:xss(req.session.authent)
                });
            }
            else{

                res.status(200).render("trainers/index", { trainer:trainers,currentUser:xss(req.session.authent)});

            }}
    }
    catch(e){
        res.status(400);
    }

});

  module.exports = constructorMethod;