var mongoose = require('mongoose');

var gatheringTypeSchema = {
  _id: { type: String }
};

// the schema is useless so far
// we need to create a model using it
var Type = mongoose.model('Type', gatheringTypeSchema);

// make this available to our Node applications
module.exports = Type;