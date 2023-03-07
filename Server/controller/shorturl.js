// write the function for api to short the url

const shortid = require('shortid');
const validUrl = require('valid-url');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const baseUrl = process.env.BASE_URL;

const router = express.Router();

// mongo model
const Url = require('../models/urls');

router.post('/shorturl', async (req, res) => {
    const { longurl } = req.body;
    const urlCode = shortid.generate();
    console.log(longurl);
    // check base url
    if (!validUrl.isUri(longurl)) {
        // give production ready warning
        return res.status(401).json('Invalid url');
    }

    // check long url
    try {
        
            const shorturl = baseUrl + '/' + urlCode;

            url = new Url({
                longurl,
                shorturl,
                urlCode,
                date: new Date(),
            });

            await url.save();

            res.json(url);
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