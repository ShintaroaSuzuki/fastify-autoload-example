import { FastifyRequest } from "fastify";
import { extractParamsForCreateUser } from "./extractParamsForCreateUser";

describe("extractParamsForCreateUser", () => {
  test("happy path", () => {
    const request = {
      body: {
        name: "John",
        age: 30,
      },
    } as FastifyRequest<{ Body: { name: string; age: number } }>;

    const result = extractParamsForCreateUser(request);
    expect(result).toEqual({ success: true, data: { name: "John", age: 30 } });
  });

  test("error path (missing body)", () => {
    const request = { body: {} } as FastifyRequest<{
      Body: { name: string; age: number };
    }>;

    const result = extractParamsForCreateUser(request);
    expect(result).toEqual({ success: false, error: { errorCode: 100 } });
  });
});
