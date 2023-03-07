const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/connectdb');
const cors = require('cors');




env.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', require('./controller/shorturl'));
app.use('/auth', require('./controller/auth'));



app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});

