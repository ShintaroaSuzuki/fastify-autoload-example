import { getUsersFromDB } from "./getUsersFromDB";
import type { Prisma } from "@/lib";

describe("getUsersFromDB", () => {
  test("happy path", async () => {
    const data = {
      prisma: {
        users: {
          findMany: jest.fn().mockResolvedValue([{ name: "foo", age: 20 }]),
        },
      } as unknown as Prisma,
    };

    const result = await getUsersFromDB(data);

    expect(result).toEqual({
      success: true,
      data: { users: [{ name: "foo", age: 20 }] },
    });
  });

  test("error path (if DB is down)", async () => {
    const data = {
      maxage: 30,
      minage: 20,
      prisma: {
        users: {
          findMany: jest.fn().mockRejectedValue(new Error("DB is down")),
        },
      } as unknown as Prisma,
    };

    const result = await getUsersFromDB(data);

    expect(result).toEqual({ success: false, error: { errorCode: 200 } });
  });
});
