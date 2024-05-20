/* eslint-disable functional/functional-parameters, functional/no-expression-statements*/
import { Prisma } from "@prisma/client";
import { prisma } from "../lib";

export const refreshDatabase = async () => {
  await clearData();
  await prisma.users.createMany({
    data: [
      { id: "1", name: "Alice", age: 30 },
      { id: "2", name: "Bob", age: 25 },
      { id: "3", name: "Charlie", age: 35 },
      { id: "4", name: "David", age: 28 },
      { id: "5", name: "Eve", age: 32 },
      { id: "8", name: "Frank", age: 29 },
      { id: "9", name: "Grace", age: 27 },
      { id: "10", name: "Hannah", age: 31 },
      { id: "11", name: "Ivy", age: 26 },
      { id: "12", name: "Jack", age: 33 },
    ],
  });

  await prisma.post.createMany({
    data: [
      {
        userId: "1",
        title: "title1",
      },
      {
        userId: "1",
        title: "title2",
        content: "content2",
      },
      {
        userId: "2",
        title: "title3",
        content: "content3",
      },
    ],
  });

  console.log("Sample data has been seeded.");
};

const clearData = async () => {
  const tables = Object.keys(Prisma.ModelName);

  // 一括削除
  /* eslint-disable functional/no-loop-statements */
  for (const table of tables) {
    await prisma.$queryRawUnsafe("SET foreign_key_checks = 0;");
    await prisma.$queryRawUnsafe(`Truncate ${table};`);
    await prisma.$queryRawUnsafe("SET foreign_key_checks = 1;");
  }
  return;
};
