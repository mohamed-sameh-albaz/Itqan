const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./src/routes/userRoutes");
const contestRoutes = require("./src/routes/contestRoutes");
const communityRoutes = require("./src/routes/communityRoutes");
const groupRoutes = require("./src/routes/groupRoutes");
const teamRoutes = require("./src/routes/teamRoutes");
const socialRoutes = require("./src/routes/socialRoutes");
const httpStatusText = require("./src/utils/httpStatusText");
// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/posts", socialRoutes);

app.all('*', (req, res, next) => {
  return res.status(404).json({status: httpStatusText.ERROR, message: 'This Resource Is Not Found'});
})
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
