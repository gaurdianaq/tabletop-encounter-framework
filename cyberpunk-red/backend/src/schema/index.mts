import { z } from 'zod';

export const RequestSchema = z.object({
  funcName: z.string(),
  payload: z.unknown(),
});
