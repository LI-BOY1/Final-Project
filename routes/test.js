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
const commentData = require("../data/comments.js");

const start = async function() {
    await commentData.addComment("Dan is a rare teacher in that she is wholly dedicated to both her practice and her students. I cannot recommend her enough to both people overcoming injury or individuals with advanced ability.", "5fb49b3d9a4c5f3b54bbdc93", 7)

    a=  await commentData.getLatestComment()

    console.log(a);
}
start()