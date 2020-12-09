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
                res.render("home", { verified: false,trainer:topTrainer,currentUser:xss(req.session.authent)});



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
            res.render("trainers/index", { verified: false,trainers:all,currentUser:xss(req.session.authent)});
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
        console.log("logout")
        res.render("logout",{verified: false});
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


router.post("/search", async (req, res) => {

    // try{
    //     const all = await trainerData.getAllTrainers();
    //     res.render("result", { verified: false,trainers:all,currentUser:xss(req.session.authent)});
    // } catch(e) {
    //     res.status(400);
    // }


    try{
        const courseCollection = await courseData.getAllCourses();
        let body = xss(req.body.searchInput);
        body = body.toLowerCase();
        const courses = [];
        for(let i = 0; i < courseCollection.length; i++){
            let cn = courseCollection[i].coursename.toLowerCase();
            let desc = courseCollection[i].courseInfo.toLowerCase();
            let foundCourse = false;
            let stype = xss(req.body.searchtype);
            if(stype=="name"){
                foundCourse = cn.includes(body);
            } else if(stype=="desc"){
                foundCourse = desc.includes(body);
            } else {
                foundCourse = cn.includes(body) || desc.includes(body) ;
            }
            if(foundCourse){
                courses.push(courseCollection[i]);
            }
        }
        if(courses.length == 0){
            res.status(404).render("home", {
                errors2: true
            });
        }
        else{
            res.status(200).render("result", {
                trainers: courses,currentUser:xss(req.session.authent)
            });
        }
    }
    catch(e){
        res.status(400);
    }

});

  module.exports = constructorMethod;