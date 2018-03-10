var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    Tour                    = require('../models/tour.model'),
    mongooseUniqueValidator = require('mongoose-unique-validator');

var userEntry = new Schema({
  //  _id: String,
    ownerCompanies: [{type: Schema.Types.ObjectId, ref: 'Companie'}],
    nameUserEntry: {type: String, default: ['']},
    tours: [{type: Schema.Types.ObjectId, ref: 'Tour'}],
    dateUserEntry: {type: Date, default: [Date()]},
    info1: {type: String, default: ['']},
    info2: {type: String, default: ['']},
    info3: {type: String, default: ['']},
    info4: {type: String, default: ['']},
    info5: {type: String, default: ['']},
    info6: {type: String, default: ['']},
    info7: {type: String, default: ['']},
    info8: {type: String, default: ['']},

  },
  {
    timestamps: true
  });

userEntry.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('UserEntry', userEntry);
