import fastify from "fastify";
import fastifyAutoLoad from "@/utils/fastifyAutoLoad";
import { refreshDatabase } from "@/utils/jest.e2e.setup";

describe("/posts/:userId", () => {
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
   * GET /posts/:userId
   */
  test("GET: happy path", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/posts/1",
    });

    expect(response.statusCode).toBe(200);
    const result = response.json();
    expect(Array.isArray(result)).toBe(true);
  });

  test("GET: bad request", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/posts//",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "リクエストが不正です",
    });
  });

  test("GET not fount", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/posts/not-found",
    });

    expect(response.statusCode).toEqual(404);
    expect(response.json()).toEqual({ error: "記事が存在しません" });
  });

  /**
   * POST posts/:userId
   */
  test("POST happy path", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/posts/2",
      body: {
        title: "hogeTitle",
        content: "hogeContent",
      },
    });

    const expected = {
      title: "hogeTitle",
      content: "hogeContent",
    };

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toMatchObject(expected);
  });
});
