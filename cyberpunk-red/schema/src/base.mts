import { Result, err, ok } from "neverthrow";
import { z } from "zod";

export const parseZodResult = <T extends unknown>(
  schema: z.ZodType<T>,
  data: unknown
): Result<T, z.ZodError<T>> => {
  const result = schema.safeParse(data);
  if (result.success) {
    return ok(result.data);
  }
  return err(result.error);
};

export const IdSchema = z.number().int();

export const safeJSONParse = Result.fromThrowable(JSON.parse);
