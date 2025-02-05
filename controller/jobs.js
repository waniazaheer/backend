const authModel = require('../models/Auth.model');
const jobsModel = require('../models/jobs.moodels'); 
    const createJobs = async (req, res) => {
        try {
            req.body.createdBy = req.user.userId
            console.log("req.user.userId", req.user.userId)
            const job = await jobsModel.create(req.body);
            res.status(201).json({
                success: true,
                job,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    };
    const getJobs = async (req, res) => { 
        try {
            const page = Number(req.query.page)|| 1
            const limit = Number(req.query.limit)|| 2
            const skip = (page - 1) * limit; 
            const jobs = await jobsModel
                .find({ createdBy: req.user.userId })
                .skip(skip)
                .limit(limit); 
            const totalJobs = await jobsModel.countDocuments({ createdBy: req.user.userId });
    
            if (jobs.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No jobs found for this user',
                });
            }
            res.status(200).json({
                success: true,
                totalJobs,
                currentPage: Number(page),
                totalPages: Math.ceil(totalJobs / limit),
                jobs,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message,
            });
        }
    };
const getSingleJobs = async (req ,res) => {
    const {id} = req.params;
    console.log(id)
    try {
        const jobs = await jobsModel.findById(id);
        if (!jobs){ 
            return res.status(404).json({
                msg: 'jobs not found'
            });
          }
            res.status(200).json(jobs);   
    } catch (error) {
        res.status(500).json({
         msg: 'server error',
         error
        })
    }}
    
    const updateJobs = async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        try {
            const jobs = await jobsModel.findByIdAndUpdate(id, body, { 
                new: true 
            })
            if (!jobs) {
                return res.status(404).json({ 
                message: 'jobs not found' 
            });
          }
            res.status(200).json({
                 message: 'jobs updated successfully with ${id}',
                  jobs
                });
          } catch (error) {
            res.status(500).json({ 
                message: 'Server error', 
                error
             });
          }
      };
    const deleteJobs = async (req,res) => {
        const {id} =req.params;
        console.log(id)
        try {
          const jobs = await jobsModel.findByIdAndDelete(id);
          if(!jobs) return res.status(404).json({msg:'jobs not found'});
          res.status(200).json({
            message:`jobs with this ${id} Deleted successfully`,
           jobs
          });
        } catch (error) {
          res.status(500).json({
            msg:'server error',
            error
        })
        }
       };

module.exports = {createJobs, getJobs, getSingleJobs,deleteJobs, updateJobs}