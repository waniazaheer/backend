require('dotenv').config()
const express = require('express')
const connectDB = require('./database/db')
const app = express()
const port = 3000

connectDB()
app.get('/', (req, res) =>{
    res.send('Hello, World!')
})
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${port}`)
})