import type { Prisma } from "@prisma/client";

export const filterUserForClient = (
  user: Prisma.UserCreateWithoutPostsInput,
) => {
  return {
    ...user,
    id: user.externalId,
  };
};
