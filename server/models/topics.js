var mongoose = require('mongoose');

var gatheringTopicSchema = {
  _id: { type: String }
};

// the schema is useless so far
// we need to create a model using it
var Topic = mongoose.model('Topic', gatheringTopicSchema);

// make this available to our Node applications
module.exports = Topic;