const mongoose = require('mongoose')

const jobsSchema = new mongoose.Schema({
    title:
     { type: String,
         required: true
         },
    company: 
    { type: String, 
        required: true 
    },
    location:
     { type: String, 
        required: true
     },
    salary: 
    { type: String

     },
    description: 
    { type: String, 
        required: true 
    },
    requirements:
     { type: String

      },
    postedDate: 
    { type: Date, default: Date.now 

    },
    additionalNotes:
     { type: String 

     },
     auth: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auth',
        }
    
})
const jobsModel = mongoose.model('jobs',jobsSchema)
module.exports = jobsModel