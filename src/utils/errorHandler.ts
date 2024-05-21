import { FastifyInstance, FastifyReply } from "fastify";
import { HTTPException } from "./exceptions";

export const errorHandler: FastifyInstance["errorHandler"] = (
  error,
  _,
  reply: FastifyReply
) => {
  if (error instanceof HTTPException) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.error,
      message: error.message,
    });
  } else {
    return reply.status(500).send({
      statusCode: 500,
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};
