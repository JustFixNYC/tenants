// Lol IDK
var repeatablePhotosArray = [
	{thumb: 'string'}, {main: 'string'}, {'created': 'string'}
];


// General geo data for a user
var geoSchema = new Schema({
	lat: {
		type: String,
		default: ''
	},
	long: {
		type: String,
		default: ''
	},
	zip: {
		type: Number,
		default: 10000
	},
	borough: {
		type: String,
		default: ''
	},
	address: {
		type: String,
		default: ''
	},
});

// Issues data
// Only has ONE TO MANY relationship, so it ties directly to problem schema
var issueSchema = new Schema ({
	name: {
		type: String,
		default: ''
	},
	emergency: {
		type: Boolean,
		default: false
	},
	known: {
		type: Boolean,
		default: false
	}
});

// Saved to User, relation to Problem (must have MANY TO MANY, possibly)
// Has many issues, directly related (ONE TO MANY)
var problemSchema = new Schema ({
	title: {
		type: String,
		default: ''
	},
	issues: [issueSchema],
	photos: [ // Better way to organize this?
		repeatablePhotosArray
	],
	description: {
		type: String,
		default: ''
	},
	start_date: { 
		type: Date, 
		default: Date.now 
	},
	create_date: { 
		type: Date, 
		default: Date.now 
	},
	related_activities: [
		{ 
			type: Schema.Types.ObjectId, 
			ref: 'Activity' 
		}
	]
});

// Stored in User, relation tied to Problem (must have many to many, possibly)
var activitySchema = new Schema ({
	date: { 
		type: Date, 
		default: Date.now 
	},
	photos: repeatablePhotosArray,
	description: {
		type: String,
		default: ''
	},
	releated_problems: [
		{ 
			type: Schema.Types.ObjectId, 
			ref: 'Problem' 
		}
	],
	followUp: 'boolean',
	fields: [{
      title: { type: String },
      value: { type: String }
    }]
});

// Our master object -- holds everything. NOTE: need problems to talk to activities, not sure if this will work
var userSchema = new Schema({
  fullName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your full name']
  },
  phone: {
    type: String,
    unique: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your phone number'],
    match: [/[0-9]{7}/, 'Please fill a valid phone number']
  },
	password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	geo: [geoSchema],
	problems: [problemsSchema],
	activities: [activitySchema]
});

var Activity = mongoose.model('Activity', activitySchema);
var Problem = mongoose.model('Problem', problemSchema);
var User = mongoose.model('User', userSchema);
