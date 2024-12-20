const db = require("../config/db");

const getCommunityStats = async (communityName) => {
  const client = await db.connect();
  try {
    const query = `
      WITH avg_points_cte AS (
        SELECT AVG(u.points) AS avg_points
        FROM Users u
        JOIN joinAs ja ON u.id = ja.user_id
        WHERE ja.community_name = $1
      )
      SELECT 
        (SELECT COUNT(*) FROM Users u JOIN joinAs ja ON u.id = ja.user_id WHERE ja.community_name = $1) AS total_users,
        (SELECT avg_points FROM avg_points_cte) AS avg_points,
        (SELECT L.name FROM Levels L, avg_points_cte WHERE L.pointsThreshold <= avg_points_cte.avg_points ORDER BY pointsThreshold DESC LIMIT 1) AS avg_level,
        (SELECT COUNT(*) FROM Groups g WHERE g.community_name = $1) AS total_groups,
        (SELECT COUNT(*) FROM Contests c JOIN Groups g ON c.group_id = g.id WHERE g.community_name = $1 AND c.status = 'finished') AS total_finished_contests,
        (SELECT COUNT(*) FROM Submissions s JOIN Tasks t ON s.task_id = t.id JOIN Contests c ON t.contest_id = c.id JOIN Groups g ON c.group_id = g.id WHERE g.community_name = $1) AS total_submissions,
        (SELECT COUNT(*) FROM Teams t WHERE t.community_name = $1) AS total_teams,
        (SELECT COUNT(*) FROM Posts p JOIN Community c ON p.comm_id = c.id WHERE c.name = $1) AS total_posts,
        (SELECT COUNT(*) FROM PostLikes pl JOIN Posts p ON pl.post_id = p.id JOIN Community c ON p.comm_id = c.id WHERE c.name = $1) AS total_reactions,
        (SELECT COUNT(*) FROM PostComments pc JOIN Posts p ON pc.post_id = p.id JOIN Community c ON p.comm_id = c.id WHERE c.name = $1) AS total_comments
      ;
    `;
    const { rows } = await db.query(query, [communityName]);
    return rows[0];
  } catch (err) {
    console.error(`Error retrieving community stats: ${err.message}`);
    throw new Error("Database error: Unable to retrieve community stats");
  } finally {
    client.release();
  }
};

const getDetailedReport = async (communityName, year) => {
  const client = await db.connect();
  try {
    const query = `
      WITH monthly_stats AS (
        SELECT 
          DATE_TRUNC('month', ja.created_at) AS month,
          COUNT(*) AS total_users,
          0::numeric AS avg_points,
          0::integer AS total_groups,
          0::integer AS total_finished_contests,
          0::integer AS total_submissions,
          0::integer AS total_teams,
          0::integer AS total_posts,
          0::integer AS total_reactions,
          0::integer AS total_comments
        FROM Users u 
        JOIN joinAs ja ON u.id = ja.user_id 
        WHERE ja.community_name = $1 AND EXTRACT(YEAR FROM ja.created_at) = $2
        GROUP BY month
        
        UNION ALL
        
        SELECT 
          DATE_TRUNC('month', g.created_at) AS month,
          0::integer AS total_users,
          0::numeric AS avg_points,
          COUNT(*) AS total_groups,
          0::integer AS total_finished_contests,
          0::integer AS total_submissions,
          0::integer AS total_teams,
          0::integer AS total_posts,
          0::integer AS total_reactions,
          0::integer AS total_comments
        FROM Groups g 
        WHERE g.community_name = $1 AND EXTRACT(YEAR FROM g.created_at) = $2
        GROUP BY month
        
        UNION ALL
        
        SELECT 
          DATE_TRUNC('month', c.end_date) AS month,
          0::integer AS total_users,
          0::numeric AS avg_points,
          0::integer AS total_groups,
          COUNT(*) AS total_finished_contests,
          0::integer AS total_submissions,
          0::integer AS total_teams,
          0::integer AS total_posts,
          0::integer AS total_reactions,
          0::integer AS total_comments
        FROM Contests c 
        JOIN Groups g ON c.group_id = g.id 
        WHERE g.community_name = $1 AND c.status = 'finished' AND EXTRACT(YEAR FROM c.end_date) = $2
        GROUP BY month
        
        UNION ALL
        
        SELECT 
          DATE_TRUNC('month', s.created_at) AS month,
          0::integer AS total_users,
          0::numeric AS avg_points,
          0::integer AS total_groups,
          0::integer AS total_finished_contests,
          COUNT(*) AS total_submissions,
          0::integer AS total_teams,
          0::integer AS total_posts,
          0::integer AS total_reactions,
          0::integer AS total_comments
        FROM Submissions s 
        JOIN Tasks t ON s.task_id = t.id 
        JOIN Contests c ON t.contest_id = c.id 
        JOIN Groups g ON c.group_id = g.id 
        WHERE g.community_name = $1 AND EXTRACT(YEAR FROM s.created_at) = $2
        GROUP BY month
        
        UNION ALL
        
        SELECT 
          DATE_TRUNC('month', t.created_at) AS month,
          0::integer AS total_users,
          0::numeric AS avg_points,
          0::integer AS total_groups,
          0::integer AS total_finished_contests,
          0::integer AS total_submissions,
          COUNT(*) AS total_teams,
          0::integer AS total_posts,
          0::integer AS total_reactions,
          0::integer AS total_comments
        FROM Teams t 
        WHERE t.community_name = $1 AND EXTRACT(YEAR FROM t.created_at) = $2
        GROUP BY month
        
        UNION ALL
        
        SELECT 
          DATE_TRUNC('month', p.created_at) AS month,
          0::integer AS total_users,
          0::numeric AS avg_points,
          0::integer AS total_groups,
          0::integer AS total_finished_contests,
          0::integer AS total_submissions,
          0::integer AS total_teams,
          COUNT(*) AS total_posts,
          0::integer AS total_reactions,
          0::integer AS total_comments
        FROM Posts p 
        JOIN Community c ON p.comm_id = c.id 
        WHERE c.name = $1 AND EXTRACT(YEAR FROM p.created_at) = $2
        GROUP BY month
        
        UNION ALL
        
        SELECT 
          DATE_TRUNC('month', pl.created_at) AS month,
          0::integer AS total_users,
          0::numeric AS avg_points,
          0::integer AS total_groups,
          0::integer AS total_finished_contests,
          0::integer AS total_submissions,
          0::integer AS total_teams,
          0::integer AS total_posts,
          COUNT(*) AS total_reactions,
          0::integer AS total_comments
        FROM PostLikes pl 
        JOIN Posts p ON pl.post_id = p.id 
        JOIN Community c ON p.comm_id = c.id 
        WHERE c.name = $1 AND EXTRACT(YEAR FROM pl.created_at) = $2
        GROUP BY month
        
        UNION ALL
        
        SELECT 
          DATE_TRUNC('month', pc.created_at) AS month,
          0::integer AS total_users,
          0::numeric AS avg_points,
          0::integer AS total_groups,
          0::integer AS total_finished_contests,
          0::integer AS total_submissions,
          0::integer AS total_teams,
          0::integer AS total_posts,
          0::integer AS total_reactions,
          COUNT(*) AS total_comments
        FROM PostComments pc 
        JOIN Posts p ON pc.post_id = p.id 
        JOIN Community c ON p.comm_id = c.id 
        WHERE c.name = $1 AND EXTRACT(YEAR FROM pc.created_at) = $2
        GROUP BY month
      )

      SELECT 
        TO_CHAR(month, 'Mon YYYY') AS name,
        COALESCE(SUM(total_users), 0) AS total_users,
        COALESCE(AVG(avg_points), 0) AS avg_points,
        COALESCE(SUM(total_groups), 0) AS total_groups,
        COALESCE(SUM(total_finished_contests), 0) AS total_finished_contests,
        COALESCE(SUM(total_submissions), 0) AS total_submissions,
        COALESCE(SUM(total_teams), 0) AS total_teams,
        COALESCE(SUM(total_posts), 0) AS total_posts,
        COALESCE(SUM(total_reactions), 0) AS total_reactions,
        COALESCE(SUM(total_comments), 0) AS total_comments
      FROM monthly_stats
      GROUP BY month
      ORDER BY month;
    `;
    const { rows } = await db.query(query, [communityName, year]);
    return rows;
  } catch (err) {
    console.error(`Error retrieving detailed report: ${err.message}`);
    throw new Error("Database error: Unable to retrieve detailed report");
  } finally {
    client.release();
  }
};

const getAcceptanceRate = async ({ communityName, groupId, contestId }) => {
  const client = await db.connect();
  try {
    let query = `
        SELECT 
        SUM(CASE WHEN s.score > 0 THEN 1 ELSE 0 END) AS accepted_count,
        SUM(CASE WHEN s.score = 0 THEN 1 ELSE 0 END) AS rejected_count
        FROM Submissions s
        JOIN Tasks t ON s.task_id = t.id
        JOIN Contests c ON t.contest_id = c.id
        JOIN Groups g ON c.group_id = g.id
        JOIN Community comm ON g.community_name = comm.name
        WHERE s.status <> 'pending' 
    `;
    const params = [];

    if (communityName) {
      query += ` AND comm.name = $1`;
      params.push(communityName);
    } else if (groupId) {
      query += ` AND g.id = $1`;
      params.push(groupId);
    } else if (contestId) {
      query += ` AND c.id = $1`;
      params.push(contestId);
    }

    console.log(query, params);

    const { rows } = await db.query(query, params);
    return rows[0];
  } catch (err) {
    console.error(`Error retrieving acceptance rate: ${err.message}`);
    throw new Error("Database error: Unable to retrieve acceptance rate");
  } finally {
    client.release();
  }
};

module.exports = { getCommunityStats, getDetailedReport, getAcceptanceRate };