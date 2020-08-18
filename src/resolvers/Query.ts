import { getUserId } from "../utils/getUserId";
import { queryType, stringArg } from "nexus";
export const Query = queryType({
  definition(t) {
    t.list.field("allUsers", {
      type: "User",
      nullable: false,
      args: {
        searchNameString: stringArg({ nullable: true }),
      },
      resolve: (parent, { searchNameString }, ctx) => {
        return ctx.prisma.users({
          where: {
            name_contains: searchNameString,
          },
        });
      },
    });
    t.field("myProfile", {
      type: "User",
      nullable: false,
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx);
        return ctx.prisma.user({ id: userId });
      },
    });
  },
});
