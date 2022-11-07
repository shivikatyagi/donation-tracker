const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
if (process.env.NODE_ENV !== 'production') 
require ('dotenv').config()

const UserSchema = new mongoose.Schema( {
    username:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot be password itself')
            }
        }
    },
    confirm_password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot be password itself')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    },
}, {
    timestamps:true
})



UserSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}


UserSchema.methods.AuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

UserSchema.statics.findByCredentials = async function(username, password)  {
    const user = await User.findOne({ username: username })
    if (!user) {
        throw new Error("Wrong email or password")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Wrong email or password")
    }
    return user;
}

UserSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    if (user.isModified('confirm_password')) {
        user.confirm_password = await bcrypt.hash(user.confirm_password, 8);
    }

    next();
})

const User = mongoose.model('User' , UserSchema);

module.exports = User;