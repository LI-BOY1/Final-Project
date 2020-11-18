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
        if(xss(req.session.authent)) {
            try{

                res.render("home", {verified: true});
            } catch(e) {
                res.status(400);
            }
        }
        else{

            res.render("home", { verified: false});
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
    app.get('/profile', (req, res) => {
        res.render('profile');
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


  module.exports = constructorMethod;