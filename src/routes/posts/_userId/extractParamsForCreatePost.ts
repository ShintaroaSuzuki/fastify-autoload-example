import { FastifyRequest } from "fastify";
import { Result } from "@/utils";

type successResponseType = {
  userId: string;
  title: string;
  content: string | null;
};

type errorResponseType = { errorCode: 400 };

// リクエストから値を取得
export const extractParamsForCreatePost = (
  request: FastifyRequest<{
    Params: {
      userId: string;
    };
    Body: {
      title: string;
      content: string | null;
    };
  }>
): Result<successResponseType, errorResponseType> => {
  const { userId } = request.params;
  const { title, content } = request.body;
  return userId !== "" && title !== ""
    ? { success: true, data: { userId, title, content } }
    : { success: false, error: { errorCode: 400 } };
};
