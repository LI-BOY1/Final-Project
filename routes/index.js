const memberRoutes = require('./members');
const editMemberRoutes = require('./editMember');

const constructorMethod = (app) => {
  app.use('/members', memberRoutes);
  app.use('/edit', editMemberRoutes)
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;