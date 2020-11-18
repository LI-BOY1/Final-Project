const data = require("../data");
const userData = data.members;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const xss = require("xss")

router.get("/", (req,res) => {
    if(xss(req.session.authent)){
        res.redirect("/profile");
    } else {
        if(xss(req.session.login_fail)){
            delete req.session.login_fail;
            res.render("login",{verified: false, error: "Error: You need to be logged in to access this page.", title: "RMC | Login"});
        } else {
            res.render("login",{verified: false, title: "RMC | Login"});
        }
    }
});


router.post("/",  async (req,res) => {
    let form = req.body;
    try{
        if(!form.emailValue || !form.psword){
            res.render("login" , {
                errors: true
            });
        } else {
            let match = false;
            let users = await userData.getAllMembers();
            for(let i=0;i<users.length;i++){
                let user = users[i];
                if(user.email == xss(form.emailValue)){
                    match = await bcrypt.compare(xss(form.psword), xss(user.password));
                    if(match){
                        req.session.authent = true;
                        req.session.user = user._id;
                        res.redirect("/profile");
                        break;
                    }
                }
            }
            if(!match){
                res.render("login" , {
                    errors: true
                });
            }
        }} catch(e){
        res.render("login" , {
            errors: true
        });
    }
});



router.post("/newAccount", async(req,res) => {
    let form = req.body;
    let exist = false;
    try {
        const users = await userData.getAllMembers();
        for(let i=0;i<users.length;i++){
            let user = users[i];
            if(user.email == xss(form.emailInput)){
                exist = true;
                break;
            }
        }
        if(exist){
            res.render("signup",{verified: false, hasErrors: true, title: "RMC | Account Creation"});
        } else {
            console.log("created")
            const newUser = await userData.addMember(xss(form.fname), xss(form.lname),xss(form.ageValue), xss(form.phoneValue), xss(form.emailValue), xss(form.addressValue), xss(form.zipcodeValue),xss(form.user_name),xss(form.psword));
            req.session.authent = true;
            req.session.user = newUser._id;
            res.redirect("/profile");
        }
    } catch(e){
        console.log(e);
        res.redirect("/");
    }
});
module.exports = router;
