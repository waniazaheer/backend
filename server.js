require('dotenv').config()
const express = require('express')

const connectDB = require('./database/db')
const router = require('./routes/Auth.route')

const app = express()
const port = process.env.PORT
connectDB()
app.use (express.json() )
app.use('/', router)
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})