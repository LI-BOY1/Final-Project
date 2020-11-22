const trainerRoutes = require('./trainers');
const commentRoutes = require('./comments');
const courseRoutes = require('./courses');
const ExpressError = require('../utils/ExpressError');
const path = require('path');
const constructorMethod = (app) => {
    app.use('/fitclub/trainers', trainerRoutes);
    app.use('/fitclub/courses', courseRoutes);
    app.use('/fitclub/trainers/:id/comments', commentRoutes);
    app.get('/', (req, res) => {
        res.render('home');
    });

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