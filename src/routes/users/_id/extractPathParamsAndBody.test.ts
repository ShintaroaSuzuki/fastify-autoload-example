import { FastifyRequest } from "fastify";
import { extractPathParamsAndBody } from "./extractPathParamsAndBody";

describe("extractPathParamsAndBody", () => {
  test("happy path (there are both name and age)", () => {
    const request = {
      params: {
        id: "123",
      },
      body: {
        name: "Alice",
        age: 30,
      },
    } as FastifyRequest<{
      Params: { id: string };
      Body: { name?: string; age?: number };
    }>;

    const result = extractPathParamsAndBody(request);
    expect(result).toEqual({
      success: true,
      data: { id: "123", name: "Alice", age: 30 },
    });
  });

  test("happy path (there is only name)", () => {
    const request = {
      params: {
        id: "123",
      },
      body: {
        name: "Alice",
      },
    } as FastifyRequest<{
      Params: { id: string };
      Body: { name?: string; age?: number };
    }>;

    const result = extractPathParamsAndBody(request);
    expect(result).toEqual({
      success: true,
      data: { id: "123", name: "Alice" },
    });
  });

  test("happy path (there is only age)", () => {
    const request = {
      params: {
        id: "123",
      },
      body: {
        age: 30,
      },
    } as FastifyRequest<{
      Params: { id: string };
      Body: { name?: string; age?: number };
    }>;

    const result = extractPathParamsAndBody(request);
    expect(result).toEqual({
      success: true,
      data: { id: "123", age: 30 },
    });
  });

  test("error path (missing params)", () => {
    const request = {
      params: { id: "" },
      body: { name: "Alice", age: 30 },
    } as FastifyRequest<{
      Params: { id: string };
      Body: { name?: string; age?: number };
    }>;

    const result = extractPathParamsAndBody(request);
    expect(result).toEqual({ success: false, error: { errorCode: 100 } });
  });

  test("error path (missing body)", () => {
    const request = { params: { id: "123" }, body: {} } as FastifyRequest<{
      Params: { id: string };
      Body: { name?: string; age?: number };
    }>;

    const result = extractPathParamsAndBody(request);
    expect(result).toEqual({ success: false, error: { errorCode: 100 } });
  });
});
