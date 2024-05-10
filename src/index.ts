/* eslint-disable functional/no-return-void, functional/no-expression-statements */
import fs from "fs";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import fastifyAutoLoad from "@/utils/fastifyAutoLoad";

const PORT = 8080;

const server = fastify();

const init = async ({ port }: { port: number }) => {
  await server.register(fastifySwagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "test fastify swagger",
        description: "testing fastify swagger",
        version: "0.0.0",
      },
    },
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  await server.register(fastifyAutoLoad);

  await server.ready();
  server.swagger();

  const responseYaml = await server.inject("/docs/yaml");
  if (responseYaml.statusCode !== 200) {
    console.error(JSON.parse(responseYaml.payload).message);
    process.exit(1);
  }
  fs.writeFileSync("docs/openapi.yaml", responseYaml.payload);

  server.listen({ port }, (err: Error | null, address: string) => {
    if (err != null) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
};

init({ port: PORT });
