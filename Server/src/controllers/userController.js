const { getAllUsers, addUser } = require("../models/userModel");

exports.getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await addUser(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
