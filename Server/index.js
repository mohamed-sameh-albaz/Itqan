const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./src/routes/userRoutes");
const contestRoutes = require("./src/routes/contestRoutes");

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/contests", contestRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
