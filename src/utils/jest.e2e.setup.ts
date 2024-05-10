/* eslint-disable functional/functional-parameters, functional/no-expression-statements*/

import { prisma } from "../lib";

export default async () => {
  await prisma.users.createMany({
    data: [
      { name: "Alice", age: 30 },
      { name: "Bob", age: 25 },
      { name: "Charlie", age: 35 },
      { name: "David", age: 28 },
      { name: "Eve", age: 32 },
      { name: "Frank", age: 29 },
      { name: "Grace", age: 27 },
      { name: "Hannah", age: 31 },
      { name: "Ivy", age: 26 },
      { name: "Jack", age: 33 },
    ],
  });

  console.log("Sample data has been seeded.");
};
