const express = require ('express');
const { createJobs, getJobs, getSingleJobs,updateJobs, deleteJobs} = require('../controller/jobs');
const jobsrouter = express.Router()
jobsrouter.post('/api/auth/:authId/jobs', createJobs);
jobsrouter.get('/getjobs', getJobs)
jobsrouter.get('/getSinglejobs/:id', getSingleJobs )
jobsrouter.patch('/updatejobs/:id', updateJobs)
jobsrouter.delete('/deletejobs/:id', deleteJobs)
module.exports = jobsrouter
