const express = require("express");
const { getCommunityStats, getDetailedReport, getAcceptanceRate, getParticipationRate } = require("../controllers/statsController");
const router = express.Router();

router.get("/summary-report", getCommunityStats);
router.get("/detailed-report", getDetailedReport);
router.get("/acceptance-rate", getAcceptanceRate);
router.get("/participation-rate", getParticipationRate);

module.exports = router;