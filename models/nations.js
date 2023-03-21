const mongoose = require("mongoose");
mongoose.set('strictQuery',true);
const Schema = mongoose.Schema;

const nationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      require: true,
      default: 'https://i.ytimg.com/vi/9hjaA7VEy0s/maxresdefault.jpg'
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var nations = mongoose.model("Nation", nationSchema);
module.exports = nations;
