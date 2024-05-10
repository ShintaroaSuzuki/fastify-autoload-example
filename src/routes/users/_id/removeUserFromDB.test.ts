import { removeUserFromDB } from "./removeUserFromDB";
import type { Prisma } from "@/lib";

describe("removeUserFromDB", () => {
  test("happy path", async () => {
    const data = {
      id: "123",
      prisma: {
        users: {
          findUnique: jest.fn().mockResolvedValue({ name: "foo", age: 20 }),
          delete: jest.fn().mockResolvedValue({ name: "foo", age: 20 }),
        },
      } as unknown as Prisma,
    };

    const result = await removeUserFromDB(data);

    expect(result).toEqual({
      success: true,
      data: { user: { name: "foo", age: 20 } },
    });
  });

  test("error path (if DB is down)", async () => {
    const data = {
      id: "123",
      prisma: {
        users: {
          findUnique: jest.fn().mockResolvedValue({ name: "foo", age: 20 }),
          delete: jest.fn().mockRejectedValue(new Error("DB is down")),
        },
      } as unknown as Prisma,
    };

    const result = await removeUserFromDB(data);

    expect(result).toEqual({ success: false, error: { errorCode: 200 } });
  });

  test("error path (user is null)", async () => {
    const data = {
      id: "123",
      prisma: {
        users: {
          findUnique: jest.fn().mockResolvedValue(null),
          delete: jest.fn().mockResolvedValue({ name: "foo", age: 20 }),
        },
      } as unknown as Prisma,
    };

    const result = await removeUserFromDB(data);

    expect(result).toEqual({ success: false, error: { errorCode: 300 } });
  });
});
