const mongoose = require('mongoose')
const { Schema } = mongoose;

const Post = new Schema({
    userId: {
        type: String,
    },
    img: {
        type: String,
    },
    content: {
        type: String,
        text:true,

    },
    like: {
        type: Array,
        default: []
    },
    savePost: {
        type: Array,
        default: []
    },
    boxCommentId: {
        type: String,
        default: ''
    },
    cloudinary_id:{
        type: String,
    },
}, { timestamps: true });
module.exports = mongoose.model('Post', Post);
