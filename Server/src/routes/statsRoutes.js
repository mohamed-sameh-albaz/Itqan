const express = require("express");
const { getCommunityStats, getDetailedReport, getAcceptanceRate } = require("../controllers/statsController");
const router = express.Router();

router.get("/summary-report", getCommunityStats);
router.get("/detailed-report", getDetailedReport);
router.get("/acceptance-rate", getAcceptanceRate);

module.exports = router;