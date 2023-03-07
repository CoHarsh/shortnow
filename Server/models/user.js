// make a mongoose model of user which store the all the url ids that he/she has created

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    urls: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Url',
        },
    ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
