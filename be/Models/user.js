const mongoose = require('mongoose')
const { Schema } = mongoose;

const User = new Schema({
    username: {
        type: String,
        unique: true,
        min: 6,
        max: 50,
        text: true,
    },
    email: {
        type: String,
        unique: true,
        min: 6,
        max: 50,
    },
    password: {
        type: String,
        unique: true,
        min: 6,
        max: 50,
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/daqk2q9yp/image/upload/v1647350689/avatarDefault_ukaa76.jpg'
    },
    birthday: {
        type: String,

    },
    hobby: {
        type: String,

    },
    contact: {
        type: String,

    },
    cloudinary_id: {
        type: String,
    },
    countNotifyMess: {
        type: Number,
        default: 0,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    blockAccount: {
        type: Boolean,
        default: false,
    },
    verify: {
        type: Boolean,
        default: false,
    },





}, { timestamps: true });
module.exports = mongoose.model('User', User);
