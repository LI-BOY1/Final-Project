const trainerRoutes = require('./trainers');
const commentRoutes = require('./comments');
const path = require('path');
const constructorMethod = (app) => {
    app.use('/trainer/profile', trainerRoutes);
    app.use('/trainer/profile', trainerRoutes);
    app.use('/trainer/profile', trainerRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Information not found' });
    });
  };
  
  module.exports = constructorMethod;