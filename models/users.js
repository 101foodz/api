const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    pub:{
        type: String,
        required: true
    },
    isset:{
        type: Boolean,
        required: true
    },
    created:{
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model("Users", UserSchema )