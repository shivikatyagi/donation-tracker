const mongoose = require('mongoose')
require('dotenv/config')
require('dotenv').config()

const url = process.env.MONGODB_URL;
mongoose.connect(url ,
{
    // useNewUrlParser: true,
    // useCreateIndex: true
}).then(() => {
    console.log('connected to');
}).catch((e) =>{
    console.log(e);
})