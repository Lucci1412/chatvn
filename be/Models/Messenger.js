const mongoose = require("mongoose");

const Messenger = new mongoose.Schema(
  {
    boxMessengerId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messenger", Messenger);