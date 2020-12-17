
const trainerRoutes = require('./trainers');
const memberRoutes = require('./members');
const editMemberRoutes = require('./editMember');
const commentRoutes = require('./comments');
const courseRoutes = require('./courses');
const userRoutes = require('./users');
const ExpressError = require('../utils/ExpressError');
const path = require('path');
const enrollRoutes = require('./enroll');
const searchRoutes = require('./searchs');



const constructorMethod = (app) => {
    app.use('/', userRoutes);
    app.use('/fitclub/trainers', trainerRoutes);
    app.use('/fitclub/courses', courseRoutes);
    app.use('/members', memberRoutes);
    app.use('/search', searchRoutes);
    app.use('/enroll', enrollRoutes);
    app.use('/fitclub/trainers/:id/comments', commentRoutes);


    app.all('*', (req, res, next) => {
        next(new ExpressError('Page Not Found', 404));
    });

    app.use((err, req, res, next) => {
        const {statusCode = 500} = err;
        if(!err.message) err.message = 'Oh No, Something Went Wrong!';
        res.status(statusCode).render('error', {err});
    });
  };
  
  module.exports = constructorMethod;

