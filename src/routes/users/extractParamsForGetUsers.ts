import { FastifyRequest } from "fastify";
import type { Result } from "@/utils";

export const extractParamsForGetUsers = (
  request: FastifyRequest<{
    Querystring: {
      maxage?: number;
      minage?: number;
    };
  }>
): Result<{ maxage?: number; minage?: number }, { errorCode: 100 }> => {
  const { maxage, minage } = request.query;
  return maxage == null || minage == null
    ? { success: true, data: { minage, maxage } }
    : maxage >= minage
    ? { success: true, data: { maxage, minage } }
    : { success: false, error: { errorCode: 100 } };
};
