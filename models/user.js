var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  description: { type: String },
  isAdmin: { type: Boolean, default: false },
  //genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

// Virtual for User's URL
UserSchema.virtual("url").get(function () {
  return "/users/" + this._id;
});

//Export model
module.exports = mongoose.model("User", UserSchema);
