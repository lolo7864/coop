var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CompanySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  comments: [
    {
      student: { type: Schema.Types.ObjectId, ref: "User" },
      content: String,
      date: { type: Date, default: Date.now },
    },
  ],
  analysis: { type: Object, default: {} },
});

// Virtual for Company's URL
CompanySchema.virtual("url").get(function () {
  return "/companies/" + this._id;
});

//Export model
module.exports = mongoose.model("Company", CompanySchema);
