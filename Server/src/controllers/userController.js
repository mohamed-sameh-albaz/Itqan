const { getAllUsers, addUser, findUserByEmail } = require("../models/userModel");
const bcrypt = require("bcrypt");
const basicAuth = require("basic-auth");
const { body, validationResult } = require("express-validator");

exports.getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = [
  // Validation rules
  body("firstname").notEmpty().withMessage("First name is required"),
  body("lastname").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email address").custom(async (email) => {
    const user = await findUserByEmail(email);
    if (user) {
      throw new Error("Email already in use");
    }
  }),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await addUser({ ...req.body, password: hashedPassword });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

exports.loginUser = async (req, res) => {
  const credentials = basicAuth(req);
  if (!credentials || !credentials.name || !credentials.pass) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  try {
    const user = await findUserByEmail(credentials.name);
    if (user && await bcrypt.compare(credentials.pass, user.password)) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
