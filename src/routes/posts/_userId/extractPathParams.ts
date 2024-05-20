import { FastifyRequest } from "fastify";
import { Result } from "@/utils";

type successResponseType = {
  userId: string;
};

type errorResponseType = { errorCode: 400 };

// リクエストから値を取得
export const extractPathParams = (
  request: FastifyRequest<{
    Params: {
      userId: string;
    };
  }>
): Result<successResponseType, errorResponseType> => {
  const { userId } = request.params;
  return userId !== ""
    ? { success: true, data: { userId } }
    : { success: false, error: { errorCode: 400 } };
};
