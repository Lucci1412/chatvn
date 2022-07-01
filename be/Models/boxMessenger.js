const mongoose = require('mongoose')
const { Schema } = mongoose;

const BoxMessenger = new Schema({
    members: {
        type: Array,
        default:[]
    }    
}, { timestamps: true });
module.exports = mongoose.model('BoxMessenger', BoxMessenger);
