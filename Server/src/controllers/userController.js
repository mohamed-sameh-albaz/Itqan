const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const basicAuth = require("basic-auth");
const { body, validationResult } = require("express-validator");

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json({
      status: "success",
      data: { users }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Validation failed",
      details: {
        field: "users",
        error: err.message
      }
    });
  }
};

exports.createUser = [
  // Validation rules
  body("firstname").notEmpty().withMessage("First name is required"),
  body("lastname").notEmpty().withMessage("Last name is required"),
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (email) => {
      const user = await userModel.findUserByEmail(email);
      if (user) {
        throw new Error("Email already in use");
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        details: errors.array().map(error => ({
          field: error.param,
          error: error.msg
        }))
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await userModel.addUser({
        ...req.body,
        password: hashedPassword,
      });
      res.status(201).json({
        status: "success",
        data: { user }
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Server Error",
        details: {
          field: "user",
          error: err.message
        }
      });
    }
  },
];

exports.loginUser = async (req, res) => {
  const credentials = basicAuth(req);
  if (!credentials || !credentials.name || !credentials.pass) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      details: {
        field: "credentials",
        error: "Invalid credentials"
      }
    });
  }

  try {
    const user = await userModel.findUserByEmail(credentials.name);
    if (user && (await bcrypt.compare(credentials.pass, user.password))) {
      res.status(200).json({
        status: "success",
        data: { user }
      });
    } else {
      res.status(401).json({
        status: "error",
        message: "Validation failed",
        details: {
          field: "credentials",
          error: "Invalid email or password"
        }
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "server",
        error: err.message
      }
    });
  }
};

exports.approveSubmission = async(req, res) => {
  const { userId, submissionId, score } = req.body;
  try {
    const approvedSub = await userModel.approveSubmission({ userId, submissionId, score });
    res.status(200).json(approvedSub);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
};

exports.updateUser = async (req, res) => {
  const { userId, firstname, lastname, email, bio, password, photo } = req.body;

  try {
    let hashedPassword;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await userModel.updateUser({
      userId,
      firstname,
      lastname,
      email,
      bio,
      password: hashedPassword,
      photo
    });

    res.status(200).json({
      status: "success",
      data: { user: updatedUser }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "user",
        error: err.message
      }
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    await userModel.deleteUser(userId);
    res.status(200).json({
      status: "success",
      message: `User with ID ${userId} has been deleted`
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "user",
        error: err.message
      }
    });
  }
};
