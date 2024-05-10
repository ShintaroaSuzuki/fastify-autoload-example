import type { Result } from "@/utils";

export const validate = ({
  id,
  name,
  age,
}: {
  id: string;
  name?: string;
  age?: number;
}): Result<{ id: string; name?: string; age?: number }, { errorCode: 200 }> => {
  return name != null && name === ""
    ? { success: false, error: { errorCode: 200 } }
    : age != null && age < 0
    ? { success: false, error: { errorCode: 200 } }
    : { success: true, data: { id, name, age } };
};
