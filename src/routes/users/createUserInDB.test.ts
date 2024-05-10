import { createUserInDB } from "./createUserInDB";
import type { Prisma } from "@/lib";

describe("createUserInDB", () => {
  test("happy path", async () => {
    const data = {
      name: "foo",
      age: 20,
      prisma: {
        users: {
          create: jest
            .fn()
            .mockResolvedValue({ id: "123", name: "foo", age: 20 }),
        },
      } as unknown as Prisma,
    };

    const result = await createUserInDB(data);

    expect(result).toEqual({
      success: true,
      data: { user: { id: "123", name: data.name, age: data.age } },
    });
  });

  test("error path (if DB is down)", async () => {
    const data = {
      name: "foo",
      age: 20,
      prisma: {
        users: {
          create: jest.fn().mockRejectedValue(new Error("DB is down")),
        },
      } as unknown as Prisma,
    };

    const result = await createUserInDB(data);

    expect(result).toEqual({ success: false, error: { errorCode: 300 } });
  });
});
