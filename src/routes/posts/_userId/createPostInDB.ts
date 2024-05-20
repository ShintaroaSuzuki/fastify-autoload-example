import { Prisma } from "@/lib";
import { Result } from "@/utils";

type inputType = {
  userId: string;
  title: string;
  content: string | null;
  prisma: Prisma;
};

type successResponseType = {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  createdAt: Date;
};

type errorResponseType = { errorCode: 500 };

export const createPostInDB = async ({
  userId,
  title,
  content,
  prisma,
}: inputType): Promise<Result<successResponseType, errorResponseType>> => {
  try {
    const data = {
      userId: userId,
      title: title,
      content: content ?? undefined,
    };

    // Postテーブルに書き込み
    const result = await prisma.post.create({
      data: data,
    });

    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: { errorCode: 500 } };
  }
};
