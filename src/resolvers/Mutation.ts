import { mutationType, arg, stringArg } from "nexus";
import generateHashPassword from "../utils/generateHashPassword";
import generateToken from "../utils/generateToken";
import mailService from "../services/sendEmail";
import { compare } from "bcrypt";
import { sign, decode, verify } from "jsonwebtoken";

export const Mutation = mutationType({
  definition(t) {
    t.field("signup", {
      type: "ActivationPayload",
      nullable: false,
      args: {
        signupInput: arg({ type: "signupInput", required: true }),
      },
      resolve: async (_, { signupInput: { name, email, password } }, ctx) => {
        try {
          const isUserExist = await ctx.prisma.$exists.user({ email });
          if (isUserExist) {
            throw new Error("Email is already associated with another user");
          }
          const hashPassword = await generateHashPassword(password);
          const token = sign(
            {
              name,
              email,
              password: hashPassword,
            },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
              expiresIn: "10m",
            }
          );
          const html = mailService.activationEmail(token);
          await mailService.sendEmail(
            process.env.EMAIL_FROM,
            email,
            "Account activation",
            html
          );
          return {
            message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    });
    t.field("accountActivation", {
      type: "ActivationPayload",
      nullable: false,
      args: {
        token: stringArg({ required: true }),
      },
      resolve: async (_, { token }, ctx) => {
        try {
          if (!token) {
            throw new Error("No token for activation");
          }
          const decoded = verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
          if (!decoded) {
            throw new Error("Expired link. Signup again");
          }
          const { name, email, password } = decode(token) as {
            name: string;
            email: string;
            password: string;
          };
          await ctx.prisma.createUser({
            name,
            password,
            email,
          });
          return {
            message: "Signup success. Please signin.",
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    });
    t.field("login", {
      type: "AuthPayload",
      nullable: false,
      args: {
        loginInput: arg({ type: "loginInput", required: true }),
      },
      resolve: async (_, { loginInput: { email, password } }, ctx) => {
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
