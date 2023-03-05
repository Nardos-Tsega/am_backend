const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: { type: String },
  artist: { type: String },
  album: { type: String },
  genre: { type: String },
});

module.exports = mongoose.model("Music", schema);
