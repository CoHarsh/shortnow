// mongoose model for urls

const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shorturl: {
        type: String,
        required: true,
        unique: true,
    },
    longurl: {
        type: String,
        required: true,
    },
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;

