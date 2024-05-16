import { Prisma } from "@/lib";
import { Result } from "@/utils";

type inputType = {
  userId: string;
  prisma: Prisma;
};

type successResponseType = {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  createdAt: Date;
}[];

type ErrorResponseType = { errorCode: 404 } | { errorCode: 500 };

export const getPostFromDB = async ({
  userId,
  prisma,
}: inputType): Promise<Result<successResponseType, ErrorResponseType>> => {
  try {
    // Postテーブルからデータを取得
    const data = await prisma.post.findMany({
      where: { userId: userId },
      select: {
        id: true,
        userId: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    // 記事が1件もない場合
    if (data.length === 0) {
      return { success: false, error: { errorCode: 404 } };
    }

    return { success: true, data: data };
  } catch (e) {
    return { success: false, error: { errorCode: 500 } };
  }
};
