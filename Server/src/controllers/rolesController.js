// const {
//   getRoles
// } = require("../models/rolesModel");
// const httpStatusText = require("../utils/httpStatusText");

// // GET /roles
// exports.getRoles = async (req, res) => {
//   try {
//     const roles = await getRoles();
//     res.status(200).json({
//       status: httpStatusText.SUCCESS,
//       data: { roles },
//     });
//   } catch (err) {
//       return res.status(500).json({
//         status: httpStatusText.ERROR,
//         message: "Server Error",
//         details: {
//           field: "get posts",
//           error: err.message,
//         },
//       });
//     }
// };