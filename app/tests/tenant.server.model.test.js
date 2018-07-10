const assert = require('assert');
const mongoose = require('mongoose');
const Tenant = mongoose.model('Tenant');

const EXAMPLE_TENANT = {
  "phone" : "9315139043", 
  "activity" : [
  ], 
  "problems" : [
  ],
  "followUpFlags" : [
  ],
  "actionFlags" : [
      "initial", 
      "allInitial", 
      "scheduleLater", 
      "isRentStabilized", 
      "statusUpdate"
  ],
  "geo" : {
      "bin" : "3031404",
      "cd" : "308",
      "zip" : "11216",
      "bUSPS" : "BROOKLYN",
      "bCode" : "3",
      "streetName" : "PARK PLACE",
      "streetNum" : "654",
      "lat" : 40.67379741301762,
      "lon" : -73.95627813225379,
      "bbl" : "3012380016"
  },
  "unit" : "1RF",
  "address" : "654 Park Place",
  "borough" : "Brooklyn",
  "fullName" : "Dan Stevenson",
  "lastName" : "Stevenson",
  "firstName" : "Dan",
  "currentAcuityEventId" : "",
  "advocateRole" : "none",
};

describe('Tenant', () => {
  it('should save without problems', done => {
    const tenant = new Tenant(EXAMPLE_TENANT);
    tenant.save(done);
  });

  it('should raise validation errors when duplicate phone number exists', done => {
    const tenant = new Tenant(EXAMPLE_TENANT);
    tenant.save(err => {
      if (err) return done(err);

      const tenant = new Tenant(EXAMPLE_TENANT);
      tenant.save(err => {
        assert.equal(err.toString(), 'ValidationError: Phone number is already registered!');
        done();
      });
    });
  });

  it('should set hasNeighbors properly', done => {
    const tenant = new Tenant(EXAMPLE_TENANT);
    tenant.save().then((tenant) => {
      assert.equal(tenant.actionFlags.indexOf('hasNeighbors'), -1);
      return tenant.save();
    }).then((tenant) => {
      // Ensure that the tenant excludes itself from potential neighbors.
      assert.equal(tenant.actionFlags.indexOf('hasNeighbors'), -1);

      // Now create a neighbor...
      const neighbor = new Tenant(EXAMPLE_TENANT);
      neighbor.phone = '9315139044';
      return neighbor.save();
    }).then((neighbor) => {
      // Our new neighbor should have hasNeighbors set!
      assert.equal(neighbor.actionFlags.filter(f => f === 'hasNeighbors').length, 1);

      return neighbor.save();
    }).then((neighbor) => {
      // Ensure that saving the neighbor again doesn't give it an extra hasNeighbors
      // action flag.
      assert.equal(neighbor.actionFlags.filter(f => f === 'hasNeighbors').length, 1);
      done();
    }).catch(done);
  });
});
