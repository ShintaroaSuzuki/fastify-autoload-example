import { FastifyRequest } from "fastify";
import type { Result } from "@/utils";

export const extractPathParams = (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>
): Result<{ id: string }, { errorCode: 100 }> => {
  const { id } = request.params;
  return id !== ""
    ? { success: true, data: { id } }
    : { success: false, error: { errorCode: 100 } };
};
