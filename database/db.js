const mongoose = require('mongoose')

const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log(`Database connect successfully with host ${mongoose.connection.host}`) 
    }).catch(err=>{
        console.log(`Error occurred in connection : ${err}`)
    })
}
 module.exports = connectDB