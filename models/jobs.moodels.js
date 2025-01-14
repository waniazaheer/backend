// const mongoose = require('mongoose')

// const jobsSchema = new mongoose.Schema({
//     title:
//      { type: String,
//          required: true
//          },
//     company: 
//     { type: String, 
//         required: true 
//     },
//     location:
//      { type: String, 
//         required: true
//      },
//     salary: 
//     { type: String

//      },
//     description: 
//     { type: String, 
//         required: true 
//     },
//     requirements:
//      { type: String

//       },
//     postedDate: 
//     { type: Date, default: Date.now 

//     },
//     additionalNotes:
//      { type: String 

//      },
//      createdBy: 
//         {
//             type: mongoose.Types.ObjectId,
//             ref: 'auth',
//         }
// })
// const jobsModel = mongoose.model('jobs',jobsSchema)
// module.exports = jobsModel

const mongoose = require('mongoose');

const jobsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String },
    description: { type: String, required: true },
    requirements: { type: String },
    postedDate: { type: Date, default: Date.now },
    additionalNotes: { type: String },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Auth', 
        required: true // Make sure it's required
    }
});

const jobsModel = mongoose.model('jobs', jobsSchema);
module.exports = jobsModel;
