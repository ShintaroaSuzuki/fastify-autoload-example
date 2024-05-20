import { FastifyRequest } from "fastify";
import { BadRequestException } from "@/utils/customError";

/* eslint-disable functional/no-throw-statements */
export const extractParamsForGetAllPost = ({
  request,
}: {
  request: FastifyRequest<{
    Querystring: { takeCount?: number };
  }>;
}): { takeCount: number } => {
  const { takeCount } = request.query;
  if (takeCount != undefined && takeCount > 999) {
    throw new BadRequestException("1000以上は指定できません");
  }

  const response = {
    takeCount: takeCount != undefined ? takeCount : 100,
  };

  return response;
};
