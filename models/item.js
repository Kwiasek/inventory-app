const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  desc: { type: String, required: true, minLength: 3, maxLength: 400 },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
});

ItemSchema.virtual("SN").get(function () {
  return this._id;
});

ItemSchema.virtual("url").get(function () {
  return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
