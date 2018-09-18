const mongoose = require('mongoose');
const config = require('../../config/config');

beforeEach(done => {
  if (mongoose.connection.readyState === 1) {
    // Cool, we're connected to the DB.
    return done();
  }
  // Wait until we're connected to the DB.
  mongoose.connection.once('open', () => done());
});

beforeEach(done => {
  mongoose.connection.db.dropDatabase(function(){
    mongoose.connection.close(() => {
      mongoose.connect(config.db, done);
    });
  });
});
