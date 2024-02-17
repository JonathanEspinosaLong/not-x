import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { filterUserForClient } from "@/server/helpers/filterUserForClient";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";

export const profileRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      let [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      if (!user) {
        [user] = await clerkClient.users.getUserList({
          userId: [input.username],
        });
      }

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return filterUserForClient(user);
    }),
});
