import type { Result } from "@/utils";

export const validate = ({
  name,
  age,
}: {
  name: string | undefined;
  age: number | undefined;
}): Result<{ name: string; age: number }, { errorCode: 200 }> => {
  return name != null && age != null && name !== "" && age >= 0
    ? { success: true, data: { name, age } }
    : { success: false, error: { errorCode: 200 } };
};
