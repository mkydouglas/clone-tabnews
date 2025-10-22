import database from "../../../../infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const db = await database.query("SHOW server_version");
  const serverVersion = db.rows[0].server_version;

  const max = await database.query("SHOW max_connections");
  const maxConnections = max.rows[0].max_connections;

  const totalConnections = await database.query(
    "SELECT COUNT(*)::int AS total_connections FROM pg_stat_activity WHERE datname = 'local_db' GROUP BY datname;",
  );
  const tc = totalConnections.rows[0].total_connections;
  console.log(tc);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      version: parseInt(serverVersion),
      max_connections: parseInt(maxConnections),
      opened_connections: tc,
    },
  });
}

export default status;
