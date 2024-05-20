import { createPostInDB } from "./createPostInDB";
import type { Prisma } from "@/lib";

describe("createPostInDB", () => {
  test("happy path", async () => {
    const data = {
      userId: "1",
      content: "hogeTest",
      title: "hogeTitle",
      // prismaの処理をモック
      prisma: {
        post: {
          create: jest.fn().mockResolvedValue({
            id: "123",
            userId: "1",
            title: "hogeTitle",
            content: "hogeTest",
            createdAt: "2021-10-21",
          }),
        },
      } as unknown as Prisma,
    };

    const result = await createPostInDB(data);
    expect(result).toEqual({
      success: true,
      data: {
        id: "123",
        userId: "1",
        title: "hogeTitle",
        content: "hogeTest",
        createdAt: "2021-10-21",
      },
    });
  });
});
