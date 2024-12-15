const roleModel = require("../models/roleModel");
const httpStatusText = require("../utils/httpStatusText");

exports.getRoles = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { roles, totalCount } = await roleModel.getAllRoles(limit, offset);
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { roles },
      pagination: {
        from: offset + 1,
        to: offset + roles.length,
        current_page: page,
        total: totalCount,
        per_page: limit,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "roles",
        error: err.message,
      },
    });
  }
};

exports.createRole = async (req, res) => {
  const { name, description, color } = req.body;
  try {
    const newRole = await roleModel.addRole({
      name,
      description,
      color,
    });
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { role: newRole },
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "role",
        error: err.message,
      },
    });
  }
};

exports.updateRole = async (req, res) => {
  const { roleId } = req.params;
  const { name, description, color } = req.body;
  try {
    const updatedRole = await roleModel.updateRoleById(roleId, {
      name,
      description,
      color,
    });
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { role: updatedRole },
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "role",
        error: err.message,
      },
    });
  }
};

exports.deleteRole = async (req, res) => {
  const { roleId } = req.params;
  try {
    await roleModel.deleteRoleById(roleId);
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: `Role with ID ${roleId} has been deleted`,
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "role",
        error: err.message,
      },
    });
  }
};