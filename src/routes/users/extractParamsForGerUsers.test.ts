import { FastifyRequest } from "fastify";
import { extractParamsForGetUsers } from "./extractParamsForGetUsers";

describe("extractParamsForGetUsers", () => {
  test("happy path (maxage >= minage)", () => {
    const request = {
      query: {
        maxage: 30,
        minage: 20,
      },
    } as FastifyRequest<{ Querystring: { maxage?: number; minage?: number } }>;

    const result = extractParamsForGetUsers(request);
    expect(result).toEqual({ success: true, data: { maxage: 30, minage: 20 } });
  });

  test("happy path (maxage is undefined)", () => {
    const request = {
      query: {
        minage: 20,
      },
    } as FastifyRequest<{ Querystring: { maxage?: number; minage?: number } }>;

    const result = extractParamsForGetUsers(request);
    expect(result).toEqual({
      success: true,
      data: { maxage: undefined, minage: 20 },
    });
  });

  test("happy path (minage is undefined)", () => {
    const request = {
      query: {
        maxage: 30,
      },
    } as FastifyRequest<{ Querystring: { maxage?: number; minage?: number } }>;

    const result = extractParamsForGetUsers(request);
    expect(result).toEqual({
      success: true,
      data: { maxage: 30, minage: undefined },
    });
  });

  test("error path (maxage < minage)", () => {
    const request = {
      query: {
        maxage: 20,
        minage: 30,
      },
    } as FastifyRequest<{ Querystring: { maxage?: number; minage?: number } }>;

    const result = extractParamsForGetUsers(request);
    expect(result).toEqual({ success: false, error: { errorCode: 100 } });
  });
});
