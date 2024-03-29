import superjson from "superjson";

import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";

export const generateSsgHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { db, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
