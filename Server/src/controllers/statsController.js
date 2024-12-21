const { getCommunityStats, getDetailedReport, getAcceptanceRate, getParticipationRate } = require("../models/statsModel");
const { getUsersByCommunityName } = require("../models/communityModel");
const { getGroupUsersCount } = require("../models/groupModel");

const httpStatusText = require("../utils/httpStatusText");

exports.getCommunityStats = async (req, res) => {
  const { communityName } = req.query;
  try {
    const stats = await getCommunityStats(communityName);
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { stats },
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "stats",
        error: err.message,
      },
    });
  }
};

exports.getDetailedReport = async (req, res) => {
  const { communityName, year } = req.query;
  const selectedYear = year || new Date().getFullYear();
  try {
    const report = await getDetailedReport(communityName, selectedYear);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const transformData = (data, key) => {
      const result = [];
      for (let i = 0; i < months.length; i++) {
        const monthName = `${months[i]} ${selectedYear}`;
        const item = data.find(d => d.name === monthName);
        result.push({
          name: monthName,
          value: item ? +item[key] : 0
        });
      }
      return result;
    };

    const response = {
      users_stats: transformData(report, 'total_users'),
      groups_stats: transformData(report, 'total_groups'),
      finished_contests_stats: transformData(report, 'total_finished_contests'),
      submissions_stats: transformData(report, 'total_submissions'),
      teams_stats: transformData(report, 'total_teams'),
      posts_stats: transformData(report, 'total_posts'),
      reactions_stats: transformData(report, 'total_reactions'),
      comments_stats: transformData(report, 'total_comments')
    };

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "report",
        error: err.message,
      },
    });
  }
};

exports.getAcceptanceRate = async (req, res) => {
  const { communityName, groupId, contestId } = req.query;
  try {
    const acceptanceRate = await getAcceptanceRate({ communityName, groupId, contestId });
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        acceptance_rate: {
          accepted_count: +acceptanceRate.accepted_count,
          rejected_count: +acceptanceRate.rejected_count,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "acceptance_rate",
        error: err.message,
      },
    });
  }
};

exports.getParticipationRate = async (req, res) => {
  const { communityName, groupId } = req.query;
  try {
    const participatied_count = await getParticipationRate({ communityName, groupId });
    let totalCount;
    if(communityName) {
      totalCount = await getUsersByCommunityName(communityName, 1, 10);
      console.log(totalCount);
      totalCount = totalCount.totalCount;
    } else {
      totalCount = await getGroupUsersCount(groupId);
    }
    const non_participatied_count = totalCount - participatied_count;
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        participatied_count: {
          participatied_count,
          non_participatied_count,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "Participation Rate",
        error: err.message,
      },
    });
  }
};