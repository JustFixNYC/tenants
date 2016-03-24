var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Access Code Schema
 */
var AccessCodeSchema = new Schema({
	name: {
    type: String,
    default: 'JustFixNYC'
  },
  organization: {
    type: String,
    default: 'Community Group'
  },
  phone: {
    type: Number,
    default: 7777777777
  },
  email: {
    type: String,
    default: 'dan@justfix.nyc'
  },
  code: {
    type: String,
    default: '111-111'
  }
});

// Check if code ID is being used already -- if so, invalidate
AccessCodeSchema.pre('save', function(next, done) {
	var self = this;
	mongoose.Models['AccessCode'].findOne({id: self.id}, function(err, user) {
		if(err) {
			done(err);
		} else if(user) {
			self.invalidate('id', 'ID must be unique');
			done(new Error('ID must be unique'));
		} else {
			done();
		}
	});

	next();
});

mongoose.model('AccessCode', AccessCodeSchema);