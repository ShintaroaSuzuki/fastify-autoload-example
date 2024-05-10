import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { JSONSchema } from "json-schema-to-ts";
import { pipe } from "ramda";
import { match } from "ts-pattern";
import { extractPathParams } from "./extractPathParams";
import { extractPathParamsAndBody } from "./extractPathParamsAndBody";
import { getUserFromDB } from "./getUserFromDB";
import { removeUserFromDB } from "./removeUserFromDB";
import { updateUserInDB } from "./updateUserInDB";
import { validate } from "./validate";
import { start, bypass, dbMiddleware } from "@/utils";

export default async function (fastify: FastifyInstance) {
  /*
   * GET /users/:id
   */
  /* eslint-disable-next-line functional/no-expression-statements */
  fastify.get(
    "/",
    {
      schema: schemas["get"],
    },
    async (
      request: FastifyRequest<{
        Params: { id: string };
      }>,
      reply: FastifyReply
    ) => {
      const getUser = dbMiddleware(getUserFromDB);
      return pipe(
        start(extractPathParams(request)),
        bypass(getUser),
        async (result) =>
          match(await result)
            .with({ error: { errorCode: 100 } }, () => {
              return reply.code(400).send({ error: "Bad Request" });
            })
            .with({ error: { errorCode: 200 } }, () => {
              return reply.code(500).send({ error: "Internal Server Error" });
            })
            .with({ error: { errorCode: 300 } }, () => {
              return reply.code(404).send({ error: "Not Found" });
            })
            .with({ success: true }, ({ data }) => {
              const { user } = data;
              return reply.code(200).send({ user });
            })
            .exhaustive()
      )();
    }
  );

  /*
   * PATCH /users/:id
   */
  /* eslint-disable-next-line functional/no-expression-statements */
  fastify.patch(
    "/",
    {
      schema: schemas["get"],
    },
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: { name?: string; age?: number };
      }>,
      reply: FastifyReply
    ) => {
      const updateUser = dbMiddleware(updateUserInDB);
      return pipe(
        start(extractPathParamsAndBody(request)),
        bypass(validate),
        bypass(updateUser),
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
            .with({ error: { errorCode: 400 } }, () => {
              return reply.code(404).send({ error: "Not Found" });
            })
            .with({ success: true }, ({ data }) => {
              const { user } = data;
              return reply.code(200).send({ user });
            })
            .exhaustive()
      )();
    }
  );

  /*
   * DELETE /users/:id
   */
  /* eslint-disable-next-line functional/no-expression-statements */
  fastify.delete(
    "/",
    {
      schema: schemas["delete"],
    },
    async (
      request: FastifyRequest<{
        Params: { id: string };
      }>,
      reply: FastifyReply
    ) => {
      const removeUser = dbMiddleware(removeUserFromDB);
      return pipe(
        start(extractPathParams(request)),
        bypass(removeUser),
        async (result) =>
          match(await result)
            .with({ error: { errorCode: 100 } }, () => {
              return reply.code(400).send({ error: "Bad Request" });
            })
            .with({ error: { errorCode: 200 } }, () => {
              return reply.code(500).send({ error: "Internal Server Error" });
            })
            .with({ error: { errorCode: 300 } }, () => {
              return reply.code(404).send({ error: "Not Found" });
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
   * GET /users/:id
   */
  get: {
    params: {
      type: "object",
      properties: {
        id: { type: "string" },
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
  /*
   * PATCH /users/:id
   */
  patch: {
    params: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
    } as const satisfies JSONSchema,
    response: {
      200: {
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
        },
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

  /*
   * DELETE /users/:id
   */
  delete: {
    params: {
      type: "object",
      properties: {
        id: { type: "string" },
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
