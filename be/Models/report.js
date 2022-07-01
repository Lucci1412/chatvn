const mongoose = require('mongoose')
const { Schema } = mongoose;

const Report = new Schema({
    content: {
        type: String,
    },
    type: {
        type: Number,
    },
    postId: {
        type: String,
    },
    userId: {
        type: String,
    },
    reporter: {
        type: String,
        text: true,
    },
}, { timestamps: true });
module.exports = mongoose.model('Report', Report);