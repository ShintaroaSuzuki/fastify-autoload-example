import type { Prisma } from "@/lib";
import type { Result } from "@/utils";

export const updateUserInDB = async ({
  id,
  name,
  age,
  prisma,
}: {
  id: string;
  name?: string;
  age?: number;
  prisma: Prisma;
}): Promise<
  Result<
    { user: { id: string; name: string; age: number } },
    { errorCode: 300 | 400 }
  >
> => {
  try {
    const isRecordExisted =
      (await prisma.users.findUnique({
        where: { id },
      })) != null;
    if (!isRecordExisted) return { success: false, error: { errorCode: 400 } };

    const user = await prisma.users.update({
      data: {
        name,
        age,
      },
      where: { id },
    });
    return {
      success: true,
      data: {
        user,
      },
    };
  } catch (e) {
    return { success: false, error: { errorCode: 300 } };
  }
};
