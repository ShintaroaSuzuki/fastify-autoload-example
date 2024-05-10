import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { JSONSchema } from "json-schema-to-ts";
import { pipe } from "ramda";
import { match } from "ts-pattern";
import { createUserInDB } from "./createUserInDB";
import { extractParamsForCreateUser } from "./extractParamsForCreateUser";
import { extractParamsForGetUsers } from "./extractParamsForGetUsers";
import { getUsersFromDB } from "./getUsersFromDB";
import { validate } from "./validate";
import { start, bypass, dbMiddleware } from "@/utils";

export default async function (fastify: FastifyInstance) {
  /*
   * GET /users
   */
  /* eslint-disable-next-line functional/no-expression-statements */
  fastify.get(
    "/",
    {
      schema: schemas["get"],
    },
    async (
      request: FastifyRequest<{
        Querystring: { maxage?: number; minage?: number };
      }>,
      reply: FastifyReply
    ) => {
      const getUsers = dbMiddleware(getUsersFromDB);
      return pipe(
        start(extractParamsForGetUsers(request)),
        bypass(getUsers),
        async (result) =>
          match(await result)
            .with({ error: { errorCode: 100 } }, () => {
              return reply.code(400).send({ error: "Bad Request" });
            })
            .with({ error: { errorCode: 200 } }, () => {
              return reply.code(500).send({ error: "Internal Server Error" });
            })
            .with({ success: true }, ({ data }) => {
              const { users } = data;
              return reply.code(200).send({ users });
            })
            .exhaustive()
      )();
    }
  );

  /*
   * POST /users
   */
  /* eslint-disable-next-line functional/no-expression-statements */
  fastify.post(
    "/",
    {
      schema: schemas["post"],
    },
    async (
      request: FastifyRequest<{ Body: { name: string; age: number } }>,
      reply: FastifyReply
    ) => {
      const createUser = dbMiddleware(createUserInDB);
      return pipe(
        start(extractParamsForCreateUser(request)),
        bypass(validate),
        bypass(createUser),
        async (result) =>
          match(await result)
            .with({ error: { errorCode: 100 } }, () => {
              return reply.code(400).send({ error: "Bad Request" });
            })
            .with({ error: { errorCode: 200 } }, () => {
              return reply.code(400).send({ error: "Bad Request" });
            })
            .with({ error: { errorCode: 300 } }, () => {
              return reply.code(500).send({ error: "Internal Server Error" });
            })
            .with({ success: true }, ({ data }) => {
              const { user } = data;
              return reply.code(200).send({ user });
            })
            .exhaustive()
      )();
    }
  );
}

const schemas = {
  /*
   * GET /users
   */
  /* eslint-disable-next-line functional/no-expression-statements */
  get: {
    querystring: {
      type: "object",
      properties: {
        maxage: { type: "number" },
        minage: { type: "number" },
      },
    } as const satisfies JSONSchema,
    response: {
      200: {
        type: "object",
        properties: {
          users: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                age: { type: "number" },
              },
            },
          },
        },
      } as const satisfies JSONSchema,
      500: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      } as const satisfies JSONSchema,
    },
  },

  /*
   * POST /users
   */
  post: {
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
    } as const satisfies JSONSchema,
    response: {
      200: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              age: { type: "number" },
            },
          },
        },
      } as const satisfies JSONSchema,
      400: {
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
      } as const satisfies JSONSchema,
    },
  },
};
