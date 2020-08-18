import { mutationType, arg } from "nexus";
import generateHashPassword from "../utils/generateHashPassword";
import generateToken from "../utils/generateToken";
import { compare } from "bcrypt";

export const Mutation = mutationType({
  definition(t) {
    t.field("signup", {
      type: "AuthPayload",
      nullable: false,
      args: {
        signupInput: arg({ type: "signupInput", required: true }),
      },
      resolve: async (
        parent,
        { signupInput: { name, email, password } },
        ctx
      ) => {
        const isUserExist = await ctx.prisma.$exists.user({ email });
        if (isUserExist) {
          throw new Error("Email is already associated with another user");
        }
        const hashPassword = await generateHashPassword(password);
        const newUser = await ctx.prisma.createUser({
          name,
          email,
          password: hashPassword,
        });
        return {
          user: newUser,
          token: generateToken(newUser.id),
        };
      },
    });
    t.field("login", {
      type: "AuthPayload",
      nullable: false,
      args: {
        loginInput: arg({ type: "loginInput", required: true }),
      },
      resolve: async (parent, { loginInput: { email, password } }, ctx) => {
        const user = await ctx.prisma.user({
          email,
        });
        if (!user) {
          throw new Error("User not exist");
        }
        const isPasswordMatch = await compare(password, user.password);
        if (!isPasswordMatch) {
          throw new Error("Password not correct");
        }
        return {
          user,
          token: generateToken(user.id),
        };
      },
    });
  },
});
