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
const JWT_SECRET = "your-secret-key";
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD, 
  },
});
const forgetPassword = async (req, res) => {
  const { Email } = req.body;
  const user = await authModel.findOne({ Email });
  if (!user) {
    return res.status(404).send("User not found");
  }

  const token = jwt.sign({ Email }, JWT_SECRET, { expiresIn: "1h" });

  const link = `http://localhost:3000/reset-password/${token}`;
  await transporter.sendMail({
    from: "your-email@gmail.com",
    to: Email,
    subject: "Password Reset",
    text: `Click here to reset your password: ${link}`,
  });

  res.send("Password reset link sent to your email.");
};
const resetpassword = async (req, res) => {
  const { token } = req.params;
  const { Password } = req.body;

  try {
    const { Email } = jwt.verify(token, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(Password, 10);
    await authModel.updateOne({ Email }, { Password: hashedPassword });

    res.send("Password reset successful.");
  } catch (err) {
    res.status(400).send("Invalid or expired token.");
  }
};

module.exports = {register,login,getAuth,deleteAuth,forgetPassword, resetpassword}