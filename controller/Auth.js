require('dotenv').config();
const authModel = require('../models/Auth.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const register = async (req, res) => {
  try {
    const { Name, Email, Phone_num, Password, image } = req.body;

    const existedUser = await authModel.findOne({ Email });
    if (existedUser) {
      return res.status(409).json({ success: false, msg: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = await authModel.create({
      Name,
      Email,
      Phone_num,
      Password: hashedPassword,
      image,
    });

    const token = jwt.sign({ Email: newUser.Email, id: newUser._id }, JWT_SECRET, { expiresIn: '12h' });

    res.status(201).json({ success: true, user: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Internal Server Error", error });
  }
};

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const existedUser = await authModel.findOne({ Email });
    if (!existedUser) {
      return res.status(404).json({ success: false, msg: "User not found. Please register first." });
    }

    const isPasswordValid = await bcrypt.compare(Password, existedUser.Password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

    const token = jwt.sign({ Email: existedUser.Email, id: existedUser._id }, JWT_SECRET, { expiresIn: '12h' });

    res.status(200).json({
      success: true,
      msg: "User logged in successfully",
      userData: existedUser,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Internal Server Error", error });
  }
};

const getAuth = async (req, res) => {
  try {
    const users = await authModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Internal Server Error", error });
  }
};

const deleteAuth = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await authModel.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    res.status(200).json({
      success: true,
      msg: `User with ID ${id} deleted successfully`,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Internal Server Error", error });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { Email } = req.body;
    const user = await authModel.findOne({ Email });

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const token = jwt.sign({ Email }, JWT_SECRET, { expiresIn: '1h' });
    const link = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: Email,
      subject: "Password Reset",
      text: `Click here to reset your password: ${link}`,
    });

    res.status(200).json({ success: true, msg: "Password reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Internal Server Error", error });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const { Email } = jwt.verify(token, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);

    await authModel.updateOne({ Email }, { Password: hashedPassword });

    res.status(200).json({ success: true, msg: "Password reset successful." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, msg: "Invalid or expired token." });
  }
};

module.exports = { register, login, getAuth, deleteAuth, forgetPassword, resetPassword };