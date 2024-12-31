require('dotenv').config();
const authModel = require('../models/Auth.model')
const bcrypt = require('bcrypt')
const jwt =require ('jsonwebtoken')
const nodemailer = require('nodemailer')
const register = async (req, res)=>{
    try {
        const {Name,Email,Phone_num,Password,image} = req.body ;
          const hashedPassword = await bcrypt.hash(Password, 10)
          const existedUser = await authModel.findOne({Email})
          if (existedUser) {
            return res.status(409).json({
            success:false,
            msg:"email already Exist,please use another email"
            })
          }
          const register = await authModel.create({
            Name: Name,
            Email:Email,
            Phone_num: Phone_num,
            image:image,
            Password:hashedPassword
          })
          const token = jwt.sign({
            Email: register.Email,
            id: register._id
          }, process.env.JWT_SECRET)
        res.status(201).json({
            success:true,
            register,
            token

        })        
    } catch (error) {
        res.status(500).json({
            success:false,
            error
        })
    }  
}
const login = async (req, res)=>{
    try {
        const {Email, Password} = req.body;
        const hashedPassword = await bcrypt.hash(Password, 10)
        const existedUser = await authModel.findOne({Email})
        if (!existedUser) {
            return res.status(409).json({
                success:false,
                msg:"email already Exist,please use another email"
            })
        }
    const comparePassword = await bcrypt.compare(Password, existedUser.Password)
    if (!comparePassword) {
        return res.status(400).json({
            success:false,
            msg:"invalid Credentials"
        })   
    }
    const token = jwt.sign({
        Email: login.email,
        id: login._id
      }, process.env.JWT_SECRET)
    res.status(200).json({
        success:true,
        msg:"User logged in",
        token
    })
} catch (error) {
    res.status(500).json({
        success:false,
        error
    })
} 

}
const getAuth = async (req, res) => {
    try {
     const auth = await authModel.find();
     res.status(200).json(auth)
   } catch (error) {
     res.status(500).json({
        message: 'Server error',
         error 
       })
    }
 }; 
 const deleteAuth = async (req,res) => {
    const {id} =req.params;
    console.log(id)
    try {
      const admin = await authModel.findByIdAndDelete(id);
      if(!admin) return res.status(404).json({msg:'Admin not found'});
      res.status(200).json({
        message:`admin with this ${id} Deleted successfully`,
        admin
      });
    } catch (error) {
      res.status(500).json({msg:'server error',error})
    }
   };
//    const forgetPassword = async (req, res)=>{
//     try {
//         const {email} = req.body;
//         const isUserExist = await authModel.findOne({email})
//         if (!isUserExist) {  
//                 return res.status(404).json({
//                 msg:"email not found"
//             });
//         }
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//               user: process.env.SMTP_EMAIL,
//               pass: process.env.SMTP_PASSWORD,
//             },
//             logger: true,
//             debug: true,
//           });
          
//           const info = await transporter.sendMail({
//             from: '"wania 👻" <waniawania430@gmail.com>', // sender address
//             to: "email", // list of receivers
//             subject: "Testing", // Subject line
//             text: "Testing studentProject", // plain text body
//             html: `<b>Click here to reset your password</b><a href='http://localhost:5000/register>link</a>`, // html body
//           });
//           console.log('info') 
//           res.status(200).json({
//             msg: 'check your email',
//             info
//           })
//     }
//     catch (error) {
//         res.status(500).json({msg:'server error',error})
//       }
// }
const forgetPassword = async (req, res) => {
  try {
    const { Email } = req.body;
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    if (!validateEmail(Email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }
    const isUserExist = await authModel.findOne({ Email });
    if (!isUserExist) {
      return res.status(404).json({ msg: "Email not found" });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL, 
        pass: process.env.SMTP_PASSWORD, 
      },
    });
    const info = await transporter.sendMail({
      from: `"Your App Name 👻" <${process.env.SMTP_EMAIL}>`,
      to: Email, 
      subject: "Password Reset Request",
      text: "Click the link below to reset your password.", 
      html: `
        <b>Click here to reset your password:</b><br>
        <a href='http://localhost:5000/reset-password'>Reset Password</a>
      `, 
    });

    console.log("Email sent:", info.messageId);

    res.status(200).json({
      msg: "Check your email for the reset link.",
      info,
    });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    res.status(500).json({ msg: "Server error", error });
  }
};



module.exports = {register,login,getAuth,deleteAuth,forgetPassword}