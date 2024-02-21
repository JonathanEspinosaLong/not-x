import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { filterUserForClient } from "@/server/helpers/filterUserForClient";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export const postsRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        include: { author: true },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      return [post].map((post) => ({
        ...post,
        author: filterUserForClient(post.author),
      }))[0];
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
      include: { author: true },
    });

    return posts.map((post) => ({
      ...post,
      author: filterUserForClient(post.author),
    }));
  }),
  getAllByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.post
        .findMany({
          where: { authorId: input.userId },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
          include: { author: true },
        })
        .then((data) => {
          return data.map((post) => ({
            ...post,
            author: filterUserForClient(post.author),
          }));
        }),
    ),
  create: privateProcedure
    .input(
      z.object({
        content: z
          .string()
          .min(1, "Must contain at least 1 character")
          .max(255),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const post = await ctx.db.post.create({
        data: { authorId, content: input.content },
      });

      return post;
    }),
});
