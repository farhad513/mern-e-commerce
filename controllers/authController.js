const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const jwt = require("jsonwebtoken");
const registerController = async (req, res) => {
  try {
    const { name, email, password, address, phone, question } = req.body;
    // validation
    if (!name) {
      return res.send({ error: "Please Enter your Name" });
    }
    if (!email) {
      return res.send({ error: "Please Enter your Email" });
    }
    if (!password) {
      return res.send({ error: "Please Enter your Password" });
    }
    if (!phone) {
      return res.send({ error: "Please Enter your Phone" });
    }
    if (!address) {
      return res.send({ error: "Please Enter your Address" });
    }
    if (!question) {
      return res.send({ error: "Please Enter your Question" });
    }
    const existingUser = await userModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return res
        .status(200)
        .send({ success: false, message: "Already Registered Please Login" });
    }
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      address,
      phone,
      password: hashedPassword,
      question,
    }).save();
    res.status(200).send({
      success: true,
      message: "User Created Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Register Failed Error",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send({ error: "Invalied email or password" });
    }
    //   user Check
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const matchedPassword = await comparePassword(password, user.password);
    if (!matchedPassword) {
      return res.status(404).send({ error: "Inavlid Email and Password" });
    }
    user.password = undefined;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Success",
      //   user: {
      //     name: user.name,
      //     email: user.email,
      //     address: user.address,
      //     phone: user.phone,
      //   },
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Login Failed Error",
      error,
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email, newPassword, question } = req.body;
    if (!email) {
      res.status(400).send({
        message: "Email is required",
      });
    }
    if (!question) {
      res.status(400).send({
        message: "Question is required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "New Password is required",
      });
    }
    // check
    const user = await userModel.findOne({ email, question });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email and Question is Wrong",
      });
    }
    const hashedPass = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(
      user._id,
      {
        password: hashedPass,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
// update profile controller
const updateProfileController = async (req, res) => {
  try {
    console.log(req.body);
    const { name, address, phone, password, question } = req.body;
    const user = await userModel.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and must be at least 6 characters",
      });
    }
    const hashedPassd = password ? await hashPassword(password) : undefined;
    const updateUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassd || user.password,
        phone: phone || user.phone,
        address: address || user.address,
        question: question || user.question,
      },
      { new: true }
    );
    console.log(updateUser, "Update User");
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Update Profile controller error",
      error,
    });
  }
};

// get All Orders
const getOrderController = () => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Get Order Controller error",
      error,
    });
  }
};
module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  updateProfileController,
  getOrderController
};
