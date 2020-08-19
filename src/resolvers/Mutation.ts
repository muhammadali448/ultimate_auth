import { mutationType, arg, stringArg, idArg } from "nexus";
import generateHashPassword from "../utils/generateHashPassword";
import generateToken from "../utils/generateToken";
import mailService from "../services/sendEmail";
import { compare } from "bcrypt";
import { sign, decode, verify } from "jsonwebtoken";
import { getUserId } from "../utils/getUserId";

export const Mutation = mutationType({
  definition(t) {
    t.field("signup", {
      type: "MessagePayload",
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
      type: "MessagePayload",
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
    t.field("resetPassword", {
      type: "MessagePayload",
      nullable: false,
      args: {
        resetPasswordInput: arg({
          type: "resetPasswordInput",
          required: true,
        }),
      },
      resolve: async (
        _,
        { resetPasswordInput: { resetPasswordLink, newPassword } },
        ctx
      ) => {
        try {
          if (!resetPasswordLink) {
            throw new Error("No reset link found");
          }
          const decoded = verify(
            resetPasswordLink,
            process.env.JWT_RESET_PASSWORD
          );
          if (!decoded) {
            throw new Error("Expired link. Try again");
          }
          const user = await ctx.prisma.users({
            where: {
              resetPasswordLink,
            },
          });
          if (!user[0]) {
            throw new Error("User not exist");
          }
          const password = await generateHashPassword(newPassword);
          await ctx.prisma.updateUser({
            where: {
              id: user[0].id,
            },
            data: {
              password,
              resetPasswordLink: "",
            },
          });
          return {
            message: `Great! Now you can login with your new password`,
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    });
    t.field("forgotPassword", {
      type: "MessagePayload",
      nullable: false,
      args: {
        email: stringArg({ required: true }),
      },
      resolve: async (_, { email }, ctx) => {
        try {
          const user = await ctx.prisma.user({
            email,
          });
          if (!user) {
            throw new Error("User not exist");
          }
          const token = sign(
            {
              _id: user.id,
              name: user.name,
            },
            process.env.JWT_RESET_PASSWORD,
            {
              expiresIn: "10m",
            }
          );
          const html = mailService.resetPassword(token);
          await ctx.prisma.updateUser({
            where: {
              id: user.id,
            },
            data: {
              resetPasswordLink: token,
            },
          });
          await mailService.sendEmail(
            process.env.EMAIL_FROM,
            email,
            "Password Reset",
            html
          );
          return {
            message: `Email has been sent to ${email}. Follow the instruction to reset your password`,
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    });
    t.field("updateUser", {
      type: "User",
      nullable: false,
      args: {
        updateUserInput: arg({ type: "UpdateUserInput", required: true }),
      },
      resolve: async (
        _,
        { updateUserInput: { name, password, email } },
        ctx
      ) => {
        const userId = getUserId(ctx);
        if (!name && !password && !email) {
          throw new Error("No Field to update");
        }
        interface DataType {
          name?: string;
          email?: string;
          password: string;
        }
        const data = {} as DataType;
        if (name) {
          data.name = name;
        }
        if (email) {
          data.email = email;
        }
        if (password) {
          data.password = await generateHashPassword(password);
        }
        const updateUser = await ctx.prisma.updateUser({
          where: {
            id: userId,
          },
          data,
        });
        return updateUser;
      },
    });
    t.field("deleteUsers", {
      type: "MessagePayload",
      nullable: false,
      args: {
        ids: arg({ type: "DeleteUserInput", required: true }),
      },
      resolve: async (parent, { ids }, ctx) => {
        await ctx.prisma.deleteManyUsers({
          id_in: ids.id,
        });
        return {
          message: "Delete users successfully",
        };
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
