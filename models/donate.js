const mongoose = require('mongoose');
const validator = require('validator');

const DonateSchema = new mongoose.Schema({
    currency:{
        type:String,
        required:true,
        trim:true
    },
    amount:{
        type:Number,
        required:true,
        trim:true
    },
    name:{
        type:String,
        trim:true
    },
    message:{
        type:String,
        trim:true
    },
    donatedto: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'UserSchema'
    },
    donatedby: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'UserSchema'
    }
},{
    timestamps:true
})

const Donate = mongoose.model('Donation' , DonateSchema )

module.exports = Donate;
