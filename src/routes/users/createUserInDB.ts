import type { Prisma } from "@/lib";
import type { Result } from "@/utils";

export const createUserInDB = async ({
  name,
  age,
  prisma,
}: {
  name: string;
  age: number;
  prisma: Prisma;
}): Promise<
  Result<
    { user: { id: string; name: string; age: number } },
    { errorCode: 300 }
  >
> => {
  try {
    const user = await prisma.users.create({
      data: {
        name,
        age,
      },
    });
    return { success: true, data: { user } };
  } catch (e) {
    return { success: false, error: { errorCode: 300 } };
  }
};
