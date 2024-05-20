import fastify from "fastify";
import fastifyAutoLoad from "@/utils/fastifyAutoLoad";
import { refreshDatabase } from "@/utils/jest.e2e.setup";

describe("/users", () => {
  const server = fastify();

  beforeAll(async () => {
    await server.register(fastifyAutoLoad);
    await server.ready();
    await refreshDatabase();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await server.close();
  });

  /*
   * GET /users
   */
  test("GET: happy path", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/users?maxage=30&minage=20",
    });

    expect(response.statusCode).toBe(200);
    const result = response.json();
    expect(Array.isArray(result.users)).toBe(true);
  });

  test("GET: missing query params", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/users",
    });

    expect(response.statusCode).toBe(200);
    const result = response.json();
    expect(Array.isArray(result.users)).toBe(true);
  });

  test("GET: bad request", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/users?maxage=20&minage=30",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "Bad Request",
    });
  });

  test("GET: internal server error", async () => {
    const { prisma } = await import("@/lib");
    jest
      .spyOn(prisma.users, "findMany")
      .mockRejectedValue(new Error("DB is down"));

    const response = await server.inject({
      method: "GET",
      url: "/users",
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      error: "Internal Server Error",
    });
  });

  /*
   * POST /users
   */
  test("POST: happy path", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/users",
      body: { name: "John", age: 30 },
    });

    expect(response.statusCode).toBe(200);
    const result = response.json();
    expect(result.user.name).toBe("John");
    expect(result.user.age).toBe(30);
    expect(result.user.id).not.toBeUndefined();
  });

  test("POST: missing body", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/users",
      body: {},
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "Bad Request",
    });
  });

  test("POST: empty name", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/users",
      body: { name: "", age: 30 },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "Bad Request",
    });
  });

  test("POST: negative age", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/users",
      body: { name: "John", age: -1 },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "Bad Request",
    });
  });

  test("POST: internal server error", async () => {
    const { prisma } = await import("@/lib");
    jest
      .spyOn(prisma.users, "create")
      .mockRejectedValue(new Error("DB is down"));

    const response = await server.inject({
      method: "POST",
      url: "/users",
      body: { name: "John", age: 30 },
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      error: "Internal Server Error",
    });
  });
});
