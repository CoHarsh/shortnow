// write the function for api to short the url

const shortid = require('shortid');
const validUrl = require('valid-url');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
const express = require('express');

const baseUrl = process.env.BASE_URL;

const router = express.Router();

// mongo model
const Url = require('../models/urls');
const User = require('../models/user');

router.post('/shorturl', async (req, res) => {
    const { longurl,userid,token } = req.body;
    // check all the fields
    if (!longurl || !userid) {
        // give production ready warning
        return res.status(401).json('Please fill all the fields');
    }

    // check user exist
    const isuserexist = User.findOne({ _id: userid });
    if (!isuserexist) {
        return res.status(401).json('User not exist');
    }

    // check the token
    // const token = req.cookies.token;
    if (!token) {
        return res.status(401).json('Unauthorized');
    }

    // get the userid by token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id !== userid) {
        return res.status(401).json('Unauthorized');
    }

    // generate short url
    const urlCode = shortid.generate();
    console.log(longurl);
    if (!validUrl.isUri(longurl)) {
        // give production ready warning
        return res.status(401).json('Invalid url');
    }

    // check long url
    try {
        const shorturl = baseUrl + '/' + urlCode;
        const url = new Url({
            longurl,
            shorturl,
            urlCode,
            date: new Date(),
        });
        await url.save();
        
        // add url to user
        const urlid = url._id;
        const updatedUser = await User.findOneAndUpdate({ _id: userid }, { $push: { urls: url._id } }, { new: true })
        console.log(updatedUser);
        if(!updatedUser){
            return res.status(401).json('User information not updated');
        }
        updatedUser.password = undefined;
        res.json({
            "message": "Url created successfully",
            'url': url,
            'user': updatedUser.toObject(),
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json('Server error');
    }
});

router.get('/:code', async (req, res) => {
    try{
        const url = await Url.findOne({ shorturl: baseUrl + '/'+ req.params.code });

        if (url) {
            return res.redirect(url.longurl);
        } else {
            return res.status(404).json('No url found');
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).json('Server error');
    }

});


module.exports = router;