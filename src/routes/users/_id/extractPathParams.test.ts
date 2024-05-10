import { FastifyRequest } from "fastify";
import { extractPathParams } from "./extractPathParams";

describe("extractPathParams", () => {
  test("happy path", () => {
    const request = {
      params: {
        id: "123",
      },
    } as FastifyRequest<{ Params: { id: string } }>;

    const result = extractPathParams(request);
    expect(result).toEqual({ success: true, data: { id: "123" } });
  });

  test("error path (missing params)", () => {
    const request = { params: { id: "" } } as FastifyRequest<{
      Params: { id: string };
    }>;

    const result = extractPathParams(request);
    expect(result).toEqual({ success: false, error: { errorCode: 100 } });
  });
});
