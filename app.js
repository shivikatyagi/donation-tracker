const express = require('express');
require('./db/mongoose')
const UserR = require('./routers/user');
const DonateR = require('./routers/donate');
if (process.env.NODE_ENV !== 'production') 
require ('dotenv').config()
const app = express()

const port = process.env.PORT || 3000



app.use(express.json())
app.use(UserR)
app.use(DonateR)


app.listen( port , ()=>{
    console.log(`Server running at port ${port}`);
})