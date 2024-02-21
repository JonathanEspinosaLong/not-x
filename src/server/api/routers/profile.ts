import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { filterUserForClient } from "@/server/helpers/filterUserForClient";
import { TRPCError } from "@trpc/server";

export const profileRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ handle: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { handle: input.handle },
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return filterUserForClient(user);
    }),
});
