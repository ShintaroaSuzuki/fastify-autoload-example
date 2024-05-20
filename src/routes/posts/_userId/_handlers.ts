import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { JSONSchema } from "json-schema-to-ts";
import { pipe } from "ramda";
import { match } from "ts-pattern";
import { createPostInDB } from "./createPostInDB";
import { extractParamsForCreatePost } from "./extractParamsForCreatePost";
import { extractPathParams } from "./extractPathParams";
import { getPostFromDB } from "./getPostFromDB";
import { bypass, dbMiddleware, start } from "@/utils";

export default async function (fastify: FastifyInstance) {
  /*
   * GET /posts/:userId
   */
  /* eslint-disable-next-line functional/no-expression-statements */
  fastify.get(
    "/", // ファイルベースルーティングを使用しているので常に '/'
    {
      schema: schemas["get"], // openapi自動生成のためにスキーマを定義
    },
    async (
      request: FastifyRequest<{ Params: { userId: string } }>, // リクエストオブジェクト
      reply: FastifyReply //レスポンスオブジェクト
    ) => {
      // Prismaインスタンスをserviceに渡している
      const getPost = dbMiddleware(getPostFromDB);

      return pipe(
        start(extractPathParams(request)),
        bypass(getPost),
        async (result) =>
          match(await result)
            .with({ success: true }, ({ data }) => {
              return reply.code(200).send(data);
            })
            .with({ error: { errorCode: 400 } }, () => {
              return reply.code(400).send({ error: "リクエストが不正です" });
            })
            .with({ error: { errorCode: 404 } }, () => {
              return reply.code(404).send({ error: "記事が存在しません" });
            })
            .with({ error: { errorCode: 500 } }, () => {
              return reply.code(500).send({ error: "サーバーエラー" });
            })
            .exhaustive()
      )();
    }
  );

  /**
   * POST posts/:userId
   */
  /* eslint-disable-next-line functional/no-expression-statements */
  fastify.post(
    "/",
    {
      schema: schemas["post"],
    },
    async (
      request: FastifyRequest<{
        Params: { userId: string };
        Body: { title: string; content: string | null };
      }>,
      reply: FastifyReply
    ) => {
      const createPost = dbMiddleware(createPostInDB);

      return pipe(
        start(extractParamsForCreatePost(request)),
        bypass(createPost),
        async (result) =>
          match(await result)
            .with({ success: true }, ({ data }) => {
              return reply.code(200).send(data);
            })
            .with({ error: { errorCode: 400 } }, () => {
              return reply.code(400).send({ error: "リクエストが不正です" });
            })
            .with({ error: { errorCode: 500 } }, () => {
              return reply.code(500).send({ error: "サーバーエラー" });
            })
            .exhaustive()
      )();
    }
  );
}

const schemas = {
  /**
   * GET /posts/:userId
   */
  get: {
    params: {
      type: "object",
      properties: {
        userId: { type: "string", description: "ユーザーID" },
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

  /**
   * POST /posts/:userId
   */
  post: {
    params: {
      type: "object",
      properties: {
        userId: { type: "string", description: "ユーザーID" },
      },
    } as const satisfies JSONSchema,
    body: {
      type: "object",
      properties: {
        title: { type: "string", description: "タイトル" },
        content: { type: "string", description: "記事" },
      },
    } as const satisfies JSONSchema,
    response: {
      200: {
        type: "object",
        properties: {
          id: { type: "string", description: "記事ID" },
          userId: { type: "string", description: "ユーザーID" },
          title: { type: "string", description: "タイトル" },
          content: { type: "string", nullable: true, description: "内容" },
          createdAt: { type: "string", description: "作成日時" },
        },
        examples: [
          {
            id: "hoge1",
            userId: "user1",
            title: "testTitle",
            content: null,
            createdAt: "2024-05-16T08:23:42.123Z",
          },
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
