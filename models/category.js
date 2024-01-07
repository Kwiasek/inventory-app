const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 30 },
  desc: { type: String, required: true, minLength: 3, maxLength: 300 },
});

CategorySchema.virtual("url").get(function () {
  return `/inventory/category/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
