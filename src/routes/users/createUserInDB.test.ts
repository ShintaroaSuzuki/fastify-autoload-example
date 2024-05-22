import { PrismaClient } from "@prisma/client";
import createPrismaMock from "prisma-mock";
import { createUserInDB } from "./createUserInDB";
import type { Prisma } from "@/lib";

let testPrisma: PrismaClient;

beforeAll(async () => {
  testPrisma = createPrismaMock();

  // テストデータ挿入
  await testPrisma.users.createMany({
    data: [
      { name: "hoge1", age: 22 },
      { name: "hoge2", age: 23 },
      { name: "hoge3", age: 23 },
      { name: "hoge4", age: 23 },
      { name: "hoge5", age: 23 },
      { name: "hoge6", age: 23 },
      { name: "hoge7", age: 23 },
      { name: "hoge8", age: 23 },
      { name: "hoge9", age: 23 },
      { name: "hoge10", age: 23 },
    ],
  });
});

describe("createUserInDB", () => {
  test("happy path", async () => {
    const data = {
      name: "foo",
      age: 20,
      prisma: testPrisma,
    };

    const result = await createUserInDB(data);

    expect(result).toMatchObject({
      success: true,
      data: { user: { name: data.name, age: data.age } },
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
