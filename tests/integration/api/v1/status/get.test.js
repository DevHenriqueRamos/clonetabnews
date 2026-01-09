async function getResponseBody() {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  return await response.json();
}

test("GET to /api/v1/status should return 200", async () => {
  const responseBody = await getResponseBody();

  const updatedAt = responseBody.updated_at;
  expect(updatedAt).toBeDefined();

  const parsedUpdatedAt = new Date(updatedAt).toISOString();
  expect(updatedAt).toEqual(parsedUpdatedAt);
});

test("GET to /api/v1/status should return number of server version", async () => {
  const responseBody = await getResponseBody();

  const serverVersion = Number(
    responseBody.dependencies.database.server_version,
  );

  expect(serverVersion).toEqual(expect.any(Number));
  expect(serverVersion).toBeGreaterThan(0);
});

test("GET to /api/v1/status should return number of max connections at server", async () => {
  const responseBody = await getResponseBody();

  const maxConnections = responseBody.dependencies.database.max_connections;

  expect(maxConnections).toEqual(expect.any(Number));
  expect(maxConnections).toBeGreaterThan(0);
});

test("GET to /api/v1/status should return number of current connections at server", async () => {
  const responseBody = await getResponseBody();

  const currentConnections =
    responseBody.dependencies.database.current_connections;

  expect(currentConnections).toEqual(expect.any(Number));
  expect(currentConnections).toBe(1);
});
