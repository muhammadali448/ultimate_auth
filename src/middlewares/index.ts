import { rule, shield, and } from "graphql-shield";
import { getUserId } from "../utils/getUserId";
import { Context } from "../types";

const rules = {
  isAuthenticatedUser: rule()((parent, args, ctx: Context) => {
    const userId = getUserId(ctx);
    return Boolean(userId);
  }),
  isAdmin: rule()(async (parent, args, ctx: Context) => {
    const userId = getUserId(ctx);
    const isAdmin = await ctx.prisma.$exists.user({
      id: userId,
      isAdmin: true,
    });
    return isAdmin;
  }),
};
export const middlewares = shield({
  Query: {
    currentUser: rules.isAuthenticatedUser,
    allUsers: and(rules.isAuthenticatedUser, rules.isAdmin),
    deleteUsers: and(rules.isAuthenticatedUser, rules.isAdmin),
  },
});
