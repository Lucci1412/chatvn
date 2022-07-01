const mongoose = require("mongoose");

const Comment = new mongoose.Schema(
    {
        postId: {
            type: String,
        },
        senderId: {
            type: String,
        },
        text: {
            type: String,
        },
        like: {
            type: Array,
            default: [],
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", Comment);