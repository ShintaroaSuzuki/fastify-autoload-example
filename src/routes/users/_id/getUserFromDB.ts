import type { Prisma } from "@/lib";
import type { Result } from "@/utils";

export const getUserFromDB = async ({
  id,
  prisma,
}: {
  id: string;
  prisma: Prisma;
}): Promise<
  Result<
    { user: { id: string; name: string; age: number } },
    { errorCode: 200 | 300 }
  >
> => {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
    });
    return user != null
      ? {
          success: true,
          data: {
            user,
          },
        }
      : { success: false, error: { errorCode: 300 } };
  } catch (e) {
    return { success: false, error: { errorCode: 200 } };
  }
};
