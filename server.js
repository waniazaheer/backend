require('dotenv').config();

const express = require('express')
const connectDB = require('./database/db')
const router = require('./routes/Auth.route')
const jobsrouter = require('./routes/jobs.route')
const authenticate = require('./middleware/authentication')
const app = express()
const port = process.env.PORT
connectDB()
app.use (express.json() )
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use('/', router)
app.use('/', authenticate, jobsrouter)

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})