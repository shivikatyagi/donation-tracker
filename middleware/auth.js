const jwt = require('jsonwebtoken');
if (process.env.NODE_ENV !== 'production') 
require('dotenv').config()
const User = require('../models/user');

const auth = async(req,res,next) => {
    try{
        const token= req.header('Authorization').replace('Bearer ' , '')
        const decoded = jwt.verify(token  , process.env.JWT_TOKEN)
        const user = await User.findOne({_id: decoded._id , 'tokens.token': token})
        if(!user){
            throw new Error('Not found')
        }
        req.user = user
        req.token = token

        next()
    }
    catch (e){
        res.status(400).send({error: 'Please authenticate'})
    }
}

module.exports = auth