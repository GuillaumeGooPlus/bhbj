var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    mongooseUniqueValidator = require('mongoose-unique-validator');

var userEntry = new Schema({
  //  _id: String,
    ownerCompanies: [{type: Schema.Types.ObjectId, ref: 'Companie'}],
    nameUserEntry: {type: String, default: ['']},

  },
  {
    timestamps: true
  });

userEntry.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('UserEntry', userEntry);
