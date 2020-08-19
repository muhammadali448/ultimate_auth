import { rule, shield, and } from "graphql-shield";
import { getUserId } from "../utils/getUserId";

const rules = {
  isAuthenticatedUser: rule()((parent, args, ctx) => {
    const userId = getUserId(ctx);
    return Boolean(userId);
  }),
};

export const middlewares = shield({
  Query: {
    currentUser: rules.isAuthenticatedUser,
  },
});
