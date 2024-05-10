import { validate } from "./validate";

describe("validate", () => {
  test("happy path", () => {
    const data = {
      id: "123",
      name: "foo",
      age: 20,
    };

    const result = validate(data);

    expect(result).toEqual({
      success: true,
      data: { id: data.id, name: data.name, age: data.age },
    });
  });

  test("error path (if name is empty)", () => {
    const data = {
      id: "123",
      name: "",
      age: 20,
    };

    const result = validate(data);

    expect(result).toEqual({ success: false, error: { errorCode: 200 } });
  });

  test("error path (if age is negative)", () => {
    const data = {
      id: "123",
      name: "foo",
      age: -1,
    };

    const result = validate(data);

    expect(result).toEqual({ success: false, error: { errorCode: 200 } });
  });
});
