import { FastifyInstance, FastifyRequest } from "fastify";
import { JSONSchema } from "json-schema-to-ts";
import { extractParamsForGetAllPost } from "./extractParamsForAllPost";
import { getAllPostFromDB } from "./getPostsFromDB";
import { dbMiddleware } from "@/utils";

export default async function (fastify: FastifyInstance) {
  /*
   * GET /posts
   */
  /* eslint-disable-next-line functional/no-expression-statements */
  fastify.get(
    "/",
    { schema: schemas["get"] },
    async (
      request: FastifyRequest<{
        Querystring: { takeCount?: number };
      }>
    ) => {
      const takeCount = extractParamsForGetAllPost({ request });
      return dbMiddleware(getAllPostFromDB)({ ...takeCount });
    }
  );
}

const schemas = {
  /**
   * GET /posts
   */
  get: {
    querystring: {
      type: "object",
      properties: {
        takeCount: { type: "number" },
      },
    } as const satisfies JSONSchema,
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "記事ID" },
            userId: { type: "string", description: "ユーザーID" },
            title: { type: "string", description: "タイトル" },
            content: {
              type: "string",
              nullable: true,
              description: "内容",
            },
            createdAt: { type: "string", description: "作成日時" },
          },
        },
        examples: [
          [
            {
              id: "hoge1",
              userId: "user1",
              title: "testTitle",
              content: null,
              createdAt: "2024-05-16T08:23:42.123Z",
            },
          ],
        ],
      } as const satisfies JSONSchema,
      400: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      } as const satisfies JSONSchema,
      404: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      } as const satisfies JSONSchema,
      500: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
};
