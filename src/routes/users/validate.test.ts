import { validate } from "./validate";

describe("validate", () => {
  test("happy path", () => {
    const data = {
      name: "foo",
      age: 20,
    };

    const result = validate(data);

    expect(result).toEqual({
      success: true,
      data: { name: data.name, age: data.age },
    });
  });

  test("error path (if name is empty)", () => {
    const data = {
      name: "",
      age: 20,
    };

    const result = validate(data);

    expect(result).toEqual({ success: false, error: { errorCode: 200 } });
  });

  test("error path (if age is negative)", () => {
    const data = {
      name: "foo",
      age: -1,
    };

    const result = validate(data);

    expect(result).toEqual({ success: false, error: { errorCode: 200 } });
  });
});
