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
                res.render("home", { verified: false,trainer:topTrainer});



            } catch(e) {
                res.status(400);
            }

    });

    router.get("/alltrainers", async(req, res) => {

        try{
            const all = await trainerData.getAllTrainers();
            res.render("trainers/index", { verified: false,trainers:all});
        } catch(e) {
            res.status(400);
        }

    });



    router.get("/signup", (req,res) => {
        if(xss(!req.session.authent)) {
            res.render("./signup",{verified: false, title: "RMC | Account Creation"});
        } else {
            res.redirect("/profile");
        }
    });

    app.get('/signin', (req, res) => {
        res.render('login');
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
            const u = await memberData.getMemberById(req.session.user.toString());
            res.render("profile",{verified: true, user: u});

        } catch(e){
            console.log(e);
            res.render("error",{verified: true});
        }
    } else {
        req.session.login_fail = true;
        res.redirect("/login");
    }
});

  module.exports = constructorMethod;