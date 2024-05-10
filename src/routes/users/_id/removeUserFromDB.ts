import type { Prisma } from "@/lib";
import type { Result } from "@/utils";

export const removeUserFromDB = async ({
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
    const isRecordExisted =
      (await prisma.users.findUnique({
        where: { id },
      })) != null;
    if (!isRecordExisted) return { success: false, error: { errorCode: 300 } };

    const user = await prisma.users.delete({
      where: { id },
    });
    return {
      success: true,
      data: {
        user,
      },
    };
  } catch (e) {
    return { success: false, error: { errorCode: 200 } };
  }
};
