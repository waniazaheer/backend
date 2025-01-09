const authModel = require('../models/Auth.model');
const jobsModel = require('../models/jobs.moodels');
    const createJobs = async (req, res) => {
        try {
            const { title, company, location, salary, description, requirements, additionalNotes } = req.body;
            const { authId } = req.params;
            const auth = await authModel.findById(authId);
            if (!auth) {
                return res.status(404).json({
                    success: false,
                    message: 'Auth not found',
                });
            }
            const job = await jobsModel.create({
                title,
                company,
                location,
                salary,
                description,
                requirements,
                additionalNotes,
                auth: auth._id,
            });
    
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
    
//     try {
//         const { title, company, location, salary, description, requirements, additionalNotes } = req.body;
//         const { authId } = req.params;
//         const auth = await authModel.findById(authId);
//         if (!auth) {
//             return res.status(404).json({ 
//                 success: false,
//                 message: 'auth not found'
//              });
//         }
//         const jobs = await jobsModel.create({
//             title,
//             company,
//             location,
//             salary,
//             description,
//             requirements,
//             additionalNotes,
//         });

//     res.status(201).json({
//         success:true,
//         jobs,

//     })        
// } catch (error) {
//     res.status(500).json({
//         success:false,
//         error
//     })
// } 
// };
const getJobs = async (req, res) => {
    const { location, company } = req.query;
    const filter = {};
    if (location) filter.location = location;
    if (company) filter.company = company;

    try {
        const jobs = await jobsModel.find(filter);
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getSingleJobs = async (req ,res) => {
    const {id} = req.params;
    console.log(id)
    try {
        const jobs = await jobsModels.findById(id);
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
          const jobs = await jobsModels.findByIdAndDelete(id);
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