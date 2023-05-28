import { publicProcedure, router } from 'trpc';
import { z } from 'zod';

export const appRouter = router({
  // ...
  userById: publicProcedure.input(z.string()).query(async (opts: { input: any }) => {
    // Retrieve the user with the given ID
    const user = 'cheese';

    return user;
  }),
});
