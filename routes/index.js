const trainerRoutes = require('./trainers');
const commentRoutes = require('./comments');
const courseRoutes = require('./courses');
const path = require('path');
const constructorMethod = (app) => {
    app.use('/fitclub/trainers', trainerRoutes);
    // app.use('/comments/', commentRoutes);
    app.use('/fitclub/courses', courseRoutes);
    app.get('/', (req, res) => {
        res.render('home');
    });
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Information not found' });
    });
  };
  
  module.exports = constructorMethod;