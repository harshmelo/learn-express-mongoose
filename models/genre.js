var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema(
  {
    name: { type: String, required: true, min: 3, max: 100 },
    url: { type: String }
  }
);


//Export model
module.exports = mongoose.model('Genre', GenreSchema);
