const mongoose = require('mongoose');
const config = require('../../config/config');

beforeEach(done => {
  mongoose.connection.db.dropDatabase(function(){
    mongoose.connection.close(() => {
      mongoose.connect(config.db, done);
    });
  });
});

afterEach(done => {
  done();
});
