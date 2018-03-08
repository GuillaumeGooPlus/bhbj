var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    mongooseUniqueValidator = require('mongoose-unique-validator');

var team = new Schema({
  //  _id: String,
    ownerCompanies: [{type: Schema.Types.ObjectId, ref: 'Companie'}],
    nameTeam: {type: String, default: ['']},

  },
  {
    timestamps: true
  });

team.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Team', team);
