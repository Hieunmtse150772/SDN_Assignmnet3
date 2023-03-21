const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    club: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    goals: {
      type: Number,
      required: true,
    },
    nation: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Nation", 
      require: true 
    },
    isCaptain: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
var players = mongoose.model("Players", playerSchema);
module.exports = players;
