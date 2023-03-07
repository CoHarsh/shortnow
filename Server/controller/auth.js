const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// check email  
const validEmail = require('email-validator');

const router = express.Router();

// mongo model
const Url = require('../models/urls');
const User = require('../models/user');

router.post('/signin', async (req, res) => {
    const { email, password,name } = req.body;
    try {
        // check all the fields
        if (!email || !password || !name) {
            // give production ready warning
            return res.status(401).json('Please fill all the fields');
        }
        console.log(email);
        // check user exist
        const isuserexist = await User.findOne({ email: email });
        if (isuserexist) {
            console.log(isuserexist);
            return res.status(401).json('User already exist');
        }
        // check email
        if (!validEmail.validate(email)) {
            // give production ready warning
            return res.status(401).json('Invalid email');
        }
        // check password
        if (password.length < 6) {
            // give production ready warning
            return res.status(401).json('Password must be atleast 6 characters');
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        // create user
        const user = new User({
            name,
            email,
            password: hashpassword,
            urls: [],
        });

        await user.save();

        // create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.cookie('token', token, { httpOnly: true });

        res.json({
            "message": "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json('Server error');

    }

});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // check all the fields
        if (!email || !password) {
            // give production ready warning
            return res.status(401).json('Please fill all the fields');
        }

        // check email
        if (!validEmail.validate(email)) {
            // give production ready warning
            return res.status(401).json('Invalid email');
        }

        // check user exist
        const isuserexist = await User.findOne({ email: email });
        if (!isuserexist) {
            return res.status(401).json('User does not exist');
        }

        // check password
        const ispasswordcorrect = await bcrypt.compare(password, isuserexist.password);
        if (!ispasswordcorrect) {
            return res.status(401).json('Invalid credentials');
        }

        // create token
        const token = jwt.sign({ id: isuserexist._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.cookie('token', token, { httpOnly: true });
        res.json({
            "message": "Login Successfully",
            user: {
                id: isuserexist._id,
                name: isuserexist.name,
                email: isuserexist.email,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json('Server error');

    }
    
});

module.exports = router;