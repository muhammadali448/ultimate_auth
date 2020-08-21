import { prisma } from "../src/generated/prisma-client";
import { createSeedDatabase, user1, user2 } from "./utils/createSeedDatabase";
import server from "../src/server";
import getClient from "./utils/getClient";
import {
  createUser,
  accountActivation,
  loginUser,
  currentUser,
  getUsers,
  deleteUsers,
  forgotPassword,
  updateUser,
  getUsersError,
  resetPassword,
} from "./utils/operations/user";
import { compare } from "bcrypt";
import { sign, JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
const client = getClient();

describe("Users Test Cases", () => {
  let serverH: any;
  beforeAll(async (done) => {
    try {
      serverH = await server.start({ port: 4000 });
      done();
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async (done) => {
    await serverH.close();
    done();
  });
  beforeEach(createSeedDatabase);
  test("should create a new user", async () => {
    const variables = {
      data: {
        name: "Muhammad Ali",
        email: "ma6627863@gmail.com",
        password: "admin123",
      },
    };
    const response = await client.mutate({
      mutation: createUser,
      variables,
    });
    expect(response.data.signup.message).toBe(
      `Email has been sent to ${
        variables.data.email
      }. Follow the instruction to activate your account`
    );
  });
  test("should activate a new user account", async () => {
    const variables = {
      token: user1.token,
    };
    const response = await client.mutate({
      mutation: accountActivation,
      variables,
    });
    expect(response.data.accountActivation.message).toBe(
      "Signup success. Please signin."
    );
  });

  test("should not activate a new user account if token not provided", async () => {
    const variables = {
      token: "",
    };
    expect(
      client.mutate({
        mutation: accountActivation,
        variables,
      })
    ).rejects.toThrow();
  });
  test("should not activate a new user account if token is expired", async () => {
    const variables = {
      token: sign({ name: "megan" }, process.env.JWT_ACCOUNT_ACTIVATION, {
        expiresIn: 0,
      }),
    };
    expect(
      client.mutate({
        mutation: accountActivation,
        variables,
      })
    ).rejects.toThrow();
  });
  test("Should not signup a user with email that is already in use ", async () => {
    const variables = {
      data: {
        ...user1.inputFields,
      },
    };
    await expect(
      client.mutate({
        mutation: createUser,
        variables,
      })
    ).rejects.toThrow();
  });
  test("Should login and provide authentication token", async () => {
    const variables = {
      data: {
        email: user1.inputFields.email,
        password: "hello123",
      },
    };
    const response = await client.mutate({
      mutation: loginUser,
      variables,
    });
    expect(response.data.login).toHaveProperty("token");
  });

  test("should not create a new user if password length is less than 8 characters", async () => {
    const variables = {
      data: {
        name: "ABC NAME",
        email: "abc222@gmail.com",
        password: "admin",
      },
    };
    await expect(
      client.mutate({
        mutation: createUser,
        variables,
      })
    ).rejects.toThrow();
  });

  test("should get users", async () => {
    const client = getClient(user2.jwt);
    const response = await client.query({
      query: getUsers,
    });
    expect(response.data.allUsers.length).toBe(2);
  });
  test("should delete users", async () => {
    const client = getClient(user2.jwt);
    const variables = {
      ids: {
        id: [user1.user.id],
      },
    };
    await client.mutate({
      mutation: deleteUsers,
      variables,
    });
    const isUserExist = await prisma.$exists.user({
      id: user1.user.id,
    });
    expect(isUserExist).toBeFalsy();
  });
  test("should not delete a user if not authenticated", async () => {
    const variables = {
      ids: {
        id: [user1.user.id],
      },
    };
    expect(
      client.mutate({
        mutation: deleteUsers,
        variables,
      })
    ).rejects.toThrow();
  });
  test("should update a user", async () => {
    const client = getClient(user1.jwt);
    const variables = {
      data: {
        name: "John Wick",
        email: "johnwick222@gmail.com",
      },
    };
    const response = await client.mutate({
      mutation: updateUser,
      variables,
    });
    expect(response.data.updateUser.name).toBe(variables.data.name);
  });
  test("should not update a user if no field is provided", async () => {
    const client = getClient(user1.jwt);
    const variables = {
      data: {},
    };
    expect(
      client.mutate({
        mutation: updateUser,
        variables,
      })
    ).rejects.toThrow();
  });
  test("should update password of a user", async () => {
    const client = getClient(user1.jwt);
    const variables = {
      data: {
        password: "admin12345",
      },
    };
    await client.mutate({
      mutation: updateUser,
      variables,
    });
    const userPassword = (await prisma.user({
      id: user1.user.id,
    })).password;
    const isPasswordMatch = await compare("admin12345", userPassword);
    expect(isPasswordMatch).toBeTruthy();
  });
  test("should not update a user if not authenticated", async () => {
    const variables = {
      data: {
        name: "John Wick",
      },
    };
    expect(
      client.mutate({
        mutation: updateUser,
        variables,
      })
    ).rejects.toThrow();
  });
  test("should forgotPassword if email is valid", async () => {
    const variables = {
      email: user1.inputFields.email,
    };
    const { data } = await client.mutate({
      mutation: forgotPassword,
      variables,
    });
    expect(data.forgotPassword.message).toBe(
      `Email has been sent to ${
        user1.inputFields.email
      }. Follow the instruction to reset your password`
    );
  });
  test("should not resetPassword if resetPasswordLink is not provided", async () => {
    const variables = {
      data: {
        newPassword: "abc12345",
        resetPasswordLink: "",
      },
    };
    expect(
      client.mutate({
        mutation: resetPassword,
        variables,
      })
    ).rejects.toThrow();
  });
  test("should not resetPassword if user not exist", async () => {
    const variables = {
      data: {
        newPassword: "abc12345",
        resetPasswordLink: sign(
          {
            _id: "a1",
            name: "abc",
          },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: "10m",
          }
        ),
      },
    };
    expect(
      client.mutate({
        mutation: resetPassword,
        variables,
      })
    ).rejects.toThrow();
  });
  test("should resetPassword if token is valid and provided", async () => {
    const variables = {
      data: {
        newPassword: "abc12345",
        resetPasswordLink: user1.resetPasswordLink,
      },
    };
    const { data } = await client.mutate({
      mutation: resetPassword,
      variables,
    });
    expect(data.resetPassword.message).toBe(
      "Great! Now you can login with your new password"
    );
  });
  test("should not forgotPassword if email is not belongs to any user", async () => {
    const variables = {
      email: "abc123@gmail.com",
    };
    expect(
      client.mutate({
        mutation: forgotPassword,
        variables,
      })
    ).rejects.toThrow();
  });
  test("should login with bad credentials", async () => {
    const variables = {
      data: { email: "hello222@gmail.com", password: "hello22222" },
    };
    await expect(
      client.mutate({
        mutation: loginUser,
        variables,
      })
    ).rejects.toThrow();
  });
  test("should login with wrong password", async () => {
    const variables = {
      data: { email: user1.inputFields.email, password: "hello22222" },
    };
    await expect(
      client.mutate({
        mutation: loginUser,
        variables,
      })
    ).rejects.toThrow();
  });
  test("Should return me query when authentication provided", async () => {
    const client = getClient(user1.jwt);
    const { data } = await client.query({ query: currentUser });
    expect(data.currentUser.id).toBe(user1.user.id);
    expect(data.currentUser.name).toBe(user1.user.name);
    expect(data.currentUser.email).toBe(user1.user.email);
  });
  test("Should reject me query without authentication", async () => {
    expect(client.query({ query: currentUser })).rejects.toThrow();
  });
  test("should give error if graphql have an error", async () => {
    const client = getClient(user1.jwt);
    expect(client.query({ query: getUsersError })).rejects.toThrow();
  });
  test("should give error if network have an error", async () => {
    const client = getClient(user1.jwt, "abcd");
    expect(client.query({ query: currentUser })).rejects.toThrow();
  });
});
