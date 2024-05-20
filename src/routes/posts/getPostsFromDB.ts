import type { Prisma } from "@/lib";
import {
  InternalServerException,
  NotFoundException,
} from "@/utils/customError";

type inputType = {
  takeCount: number;
  prisma: Prisma;
};

type successResponseType = {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  createdAt: Date;
}[];

export const getAllPostFromDB = async ({
  takeCount,
  prisma,
}: inputType): Promise<successResponseType> => {
  try {
    // postテーブルから全てのデータ取得
    const response = await prisma.post.findMany({
      take: takeCount,
    });

    // データが無い場合
    if (response.length === 0) {
      throw new NotFoundException();
    }

    return response;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw new NotFoundException("データがありません");
    }
    throw new InternalServerException("サーバーエラー");
  }
};
