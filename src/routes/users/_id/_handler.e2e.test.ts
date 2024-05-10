import fastify from "fastify";
import fastifyAutoLoad from "@/utils/fastifyAutoLoad";

type User = {
  id: string;
  name: string;
  age: number;
};

describe("/users/:id", () => {
  const server = fastify();

  beforeAll(async () => {
    await server.register(fastifyAutoLoad);
    await server.ready();
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
    const user: User = await server
      .inject({
        method: "GET",
        url: "/users",
      })
      .then((response) => response.json().users[0]);
    const userId = user.id;

    const response = await server.inject({
      method: "GET",
      url: `/users/${userId}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ user });
  });

  test("GET: bad request", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/users//",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "Bad Request",
    });
  });

  test("GET: not found", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/users/not-found",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: "Not Found",
    });
  });

  test("GET: internal server error", async () => {
    const { prisma } = await import("@/lib");
    jest
      .spyOn(prisma.users, "findUnique")
      .mockRejectedValue(new Error("DB is down"));

    const response = await server.inject({
      method: "GET",
      url: "/users/123",
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      error: "Internal Server Error",
    });
  });

  /*
   * PATCH /users
   */
  test("PATCH: happy path (there are both name and age)", async () => {
    const user: User = await server
      .inject({
        method: "GET",
        url: "/users",
      })
      .then((response) => response.json().users[0]);
    const userId = user.id;

    const response = await server.inject({
      method: "PATCH",
      url: `/users/${userId}`,
      body: {
        name: `${user.name} Updated`,
        age: user.age + 1,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      user: { ...user, name: `${user.name} Updated`, age: user.age + 1 },
    });

    const updatedUser = await server
      .inject({
        method: "GET",
        url: `/users/${userId}`,
      })
      .then((response) => response.json().user);
    expect(updatedUser.name).toBe(`${user.name} Updated`);
    expect(updatedUser.age).toBe(user.age + 1);
  });

  test("PATCH: happy path (there is only name)", async () => {
    const user: User = await server
      .inject({
        method: "GET",
        url: "/users",
      })
      .then((response) => response.json().users[0]);
    const userId = user.id;
    const response = await server.inject({
      method: "PATCH",
      url: `/users/${userId}`,
      body: {
        name: `${user.name} Updated`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      user: { ...user, name: `${user.name} Updated`, age: user.age },
    });

    const updatedUser = await server
      .inject({
        method: "GET",
        url: `/users/${userId}`,
      })
      .then((response) => response.json().user);
    expect(updatedUser.name).toBe(`${user.name} Updated`);
    expect(updatedUser.age).toBe(user.age);
  });

  test("PATCH: happy path (there is only age)", async () => {
    const user: User = await server
      .inject({
        method: "GET",
        url: "/users",
      })
      .then((response) => response.json().users[0]);
    const userId = user.id;

    const response = await server.inject({
      method: "PATCH",
      url: `/users/${userId}`,
      body: {
        age: user.age + 1,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      user: { ...user, name: user.name, age: user.age + 1 },
    });

    const updatedUser = await server
      .inject({
        method: "GET",
        url: `/users/${userId}`,
      })
      .then((response) => response.json().user);
    expect(updatedUser.name).toBe(user.name);
    expect(updatedUser.age).toBe(user.age + 1);
  });

  test("PATCH: bad request (there is neither name nor age))", async () => {
    const user: User = await server
      .inject({
        method: "GET",
        url: "/users",
      })
      .then((response) => response.json().users[0]);
    const userId = user.id;

    const response = await server.inject({
      method: "PATCH",
      url: `/users/${userId}`,
      body: {},
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "Bad Request",
    });
  });

  test("PATCH: bad request (path params is invalid))", async () => {
    const response = await server.inject({
      method: "PATCH",
      url: "/users//",
      body: {
        name: "John",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "Bad Request",
    });
  });

  test("PATCH: not found", async () => {
    const response = await server.inject({
      method: "PATCH",
      url: "/users/not-found",
      body: {
        name: "John",
      },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: "Not Found",
    });
  });

  test("PATCH: internal server error", async () => {
    const { prisma } = await import("@/lib");
    jest
      .spyOn(prisma.users, "update")
      .mockRejectedValue(new Error("DB is down"));

    const user: User = await server
      .inject({
        method: "GET",
        url: "/users",
      })
      .then((response) => response.json().users[0]);
    const userId = user.id;

    const response = await server.inject({
      method: "PATCH",
      url: `/users/${userId}`,
      body: {
        name: "John",
      },
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      error: "Internal Server Error",
    });
  });

  /*
   * DELETE /users
   */
  test("DELETE: happy path", async () => {
    const user: User = await server
      .inject({
        method: "GET",
        url: "/users",
      })
      .then((response) => response.json().users[0]);
    const userId = user.id;
    const response = await server.inject({
      method: "DELETE",
      url: `/users/${userId}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ user });
  });

  test("DELETE: bad request", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: "/users//",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "Bad Request",
    });
  });

  test("DELETE: not found", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: "/users/not-found",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: "Not Found",
    });
  });

  test("DELETE: internal server error", async () => {
    const { prisma } = await import("@/lib");
    jest
      .spyOn(prisma.users, "delete")
      .mockRejectedValue(new Error("DB is down"));

    const user: User = await server
      .inject({
        method: "GET",
        url: "/users",
      })
      .then((response) => response.json().users[0]);
    const userId = user.id;

    const response = await server.inject({
      method: "DELETE",
      url: `/users/${userId}`,
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      error: "Internal Server Error",
    });
  });
});
