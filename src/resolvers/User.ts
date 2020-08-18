import { prismaObjectType } from "nexus-prisma";

export const User = prismaObjectType<"User">({
  name: "User",
  definition(t) {
    t.prismaFields(["id", "email", "name"]);
  },
});
