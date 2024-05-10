import type { Prisma } from "@/lib";
import type { Result } from "@/utils";

export const getUsersFromDB = async ({
  maxage,
  minage,
  prisma,
}: {
  maxage?: number;
  minage?: number;
  prisma: Prisma;
}): Promise<
  Result<
    { users: { id: string; name: string; age: number }[] },
    { errorCode: 200 }
  >
> => {
  try {
    const users = await prisma.users.findMany({
      where: {
        age: {
          gte: minage,
          lte: maxage,
        },
      },
    });
    return {
      success: true,
      data: {
        users,
      },
    };
  } catch (e) {
    return { success: false, error: { errorCode: 200 } };
  }
};
