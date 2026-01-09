import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const serverVersion = await getServerInformation("server_version");
  const maxConnections = await getServerInformation("max_connections");
  const currentConnections = await getServerCurrentConnections();

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        server_version: serverVersion,
        max_connections: parseInt(maxConnections),
        current_connections: currentConnections,
      },
    },
  });
}

async function getServerInformation(settingName) {
  const result = await database.query(`SHOW ${settingName}`);

  return result.rows[0][settingName];
}

async function getServerCurrentConnections() {
  const databaseName = process.env.POSTGRES_DB;
  const result = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });

  return result.rows[0].count;
}

export default status;
