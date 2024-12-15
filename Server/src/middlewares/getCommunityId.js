const db = require("../config/db");
const httpStatusText = require("../utils/httpStatusText")
exports.getCommunityId = async (req, res, next) => {
  const client = await db.connect();
  try {
    let Qflag = true;
    let { communityName } = req.query;
    if (!communityName) {
      Qflag = false;
      communityName = req.body.communityName;
    }
    if (!communityName) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        message: "Invalid community name",
      });
    }
    const query = `
      SELECT id
      FROM Community
      WHERE name = $1;
    `;
    const { rows } = await db.query(query, [communityName]);
    if (rows.length === 0) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        message: "Community not found",
      });
    }
    if (Qflag) {
      req.query.communityId = rows[0].id;
    } else {
      req.body.communityId = rows[0].id;
    }
    next();
  } catch (err) {
    console.error(`Error in get community id middleware: ${err.message}`);
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "fail get communitiy id",
        error: err.message,
      },
    });
  }
  finally{
    client.release();
  }
};

//module.exports = getCommunityId;
