import { FastifyRequest } from "fastify";
import type { Result } from "@/utils";

export const extractPathParamsAndBody = (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: {
      name?: string;
      age?: number;
    };
  }>
): Result<{ id: string; name?: string; age?: number }, { errorCode: 100 }> => {
  const { id } = request.params;
  const { name, age } = request.body;
  return id !== ""
    ? name != null || age != null
      ? { success: true, data: { id, name, age } }
      : { success: false, error: { errorCode: 100 } }
    : { success: false, error: { errorCode: 100 } };
};
