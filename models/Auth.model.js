const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({

    Name:{
        type:String,
        required:[true,'Name  is equired field']
    },
    Email:{
        type:String,
        required:[true,'Email is required field']
    },
    Phone_num:{
        type:Number,
        require:[true,'phone_num is require filed']
    },
    Password:{
        type:String,
        required:[true,'Password is equired field'],
        minLength:[8, 'Password must be atleast of 8 characters'],
    },
    image:{
        type:String,
        // require:[true,'image is required filed ']
    },
    role:{
        type:String,
        enum:['user', 'admin'],
        default:'user'
    }
})
const authModel = mongoose.model('auth',authSchema)
module.exports = authModel