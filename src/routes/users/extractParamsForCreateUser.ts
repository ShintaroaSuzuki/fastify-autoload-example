import { FastifyRequest } from "fastify";
import type { Result } from "@/utils";

export const extractParamsForCreateUser = (
  request: FastifyRequest<{
    Body: { name: string; age: number };
  }>
): Result<{ name: string; age: number }, { errorCode: 100 }> => {
  const { name, age } = request.body;
  return name != undefined && age != undefined
    ? { success: true, data: { name, age } }
    : { success: false, error: { errorCode: 100 } };
};
