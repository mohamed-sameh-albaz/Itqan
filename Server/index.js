const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./src/routes/userRoutes");
const contestRoutes = require("./src/routes/contestRoutes");
const communityRoutes = require("./src/routes/communityRoutes");
const groupRoutes = require("./src/routes/groupRoutes");
const teamRoutes = require("./src/routes/teamRoutes");

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/groups", groupRoutes); // Add this line
app.use("/api/teams", teamRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
