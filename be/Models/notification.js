const mongoose = require("mongoose");

const Notification = new mongoose.Schema(
    {
        postId: {
            type: String,
        },
        senderId: {
            type: String,
        },
        receiverId: {
            type: String,
        },
        type:{
            type: Number,
        },
        status: {
            type: Boolean,
            default:true,
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", Notification);