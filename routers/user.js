const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user'); 
const auth = require('../middleware/auth.js');
const router = express.Router();


router.post('/users' , async(req,res) => {
    try{
        const user = await User.findOne({username:req.body.username})
        if(user) 
        return res.status(201).send({message:"user already exists"})
        else
        {
            const user = new User(req.body)
            await user.save()
            const token = await user.AuthToken()
            return res.status(201).send({ user, token })
        }
    } catch(e) {
        res.status(400).send(e)
    }
})
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.AuthToken()
        res.send({user:user, token})
    } catch (e) {
        res.status(400).send("User does not exist")
    }
})

router.post('/users/logout' , auth , async(req,res) => {
    try{
        req.user.tokens =req.user.tokens.filter( token =>{
            return token.token !== req.token
        })
        await req.user.save()
         
        res.status(200).send('You have Logged out successfully!!')
    }catch(e){
        res.status(500).send("error")
    }
})


router.get('/users/me' , auth , async (req,res) =>{
    res.send(req.user)
})

router.get('/allusers' ,auth , async (req,res) =>{
    try {
        const users = await User.find({})
        if(!users) return res.status(400).send({message:"No user exist"})
        else {
            res.send(users)
        }

    }
    catch(e) {
        res.status(400).send(e)
    }
})

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file ,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('Please upload a image file'))
        }
        cb(undefined , true)
    } 
})

router.post('/users/me/avatar' , auth , upload.single('avatar') ,async(req,res) =>{
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send("image recieved")
},(error , req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar' , auth , async(req,res) =>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})


module.exports = router