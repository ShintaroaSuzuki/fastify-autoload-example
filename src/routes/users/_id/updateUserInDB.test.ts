import { updateUserInDB } from "./updateUserInDB";
import type { Prisma } from "@/lib";

describe("updateUserInDB", () => {
  test("happy path", async () => {
    const data = {
      id: "123",
      prisma: {
        users: {
          findUnique: jest.fn().mockResolvedValue({ name: "foo", age: 20 }),
          update: jest.fn().mockResolvedValue({ name: "foo", age: 20 }),
        },
      } as unknown as Prisma,
    };

    const result = await updateUserInDB(data);

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
          update: jest.fn().mockRejectedValue(new Error("DB is down")),
        },
      } as unknown as Prisma,
    };

    const result = await updateUserInDB(data);

    expect(result).toEqual({ success: false, error: { errorCode: 300 } });
  });

  test("error path (user is null)", async () => {
    const data = {
      id: "123",
      prisma: {
        users: {
          findUnique: jest.fn().mockResolvedValue(null),
          update: jest.fn().mockResolvedValue({ name: "foo", age: 20 }),
        },
      } as unknown as Prisma,
    };

    const result = await updateUserInDB(data);

    expect(result).toEqual({ success: false, error: { errorCode: 400 } });
  });
});
