'use strict';

const _ = require('lodash');

const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI;

if (!MONGODB_TEST_URI)
  throw new Error(`Please define the environment variable MONGODB_TEST_URI!`);

module.exports = _.extend({}, require('./development'), {
  db: MONGODB_TEST_URI,
});
