import { prisma } from "../../src/generated/prisma-client";
import { hashSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import generateToken from "../../src/utils/generateToken";
const user1 = {
  inputFields: {
    name: "John Smith",
    email: "john_smith222@gmail.com",
    password: hashSync("hello123", 10),
  },
  user: undefined as any,
  jwt: undefined as string,
  token: undefined as string,
  resetPasswordLink: undefined as string,
};

const user2 = {
  inputFields: {
    name: "Will Boogieman",
    email: "will222@gmail.com",
    password: hashSync("will123", 10),
  },
  user: undefined as any,
  jwt: undefined as string,
  token: undefined as string,
};

const createSeedDatabase = async () => {
  // jest.setTimeout(10000);
  await prisma.deleteManyUsers();

  user1.user = await prisma.createUser({
    ...user1.inputFields,
  });
  user1.token = sign(
    {
      name: "wick john",
      email: "youknow22@gmail.com",
      password: hashSync("will123", 10),
    },
    process.env.JWT_ACCOUNT_ACTIVATION,
    {
      expiresIn: "10m",
    }
  );
  user2.user = await prisma.createUser({
    ...user2.inputFields,
  });
  user2.token = sign(
    {
      ...user2.inputFields,
    },
    process.env.JWT_ACCOUNT_ACTIVATION,
    {
      expiresIn: "10m",
    }
  );
  user1.resetPasswordLink = (await prisma.updateUser({
    data: {
      resetPasswordLink: sign(
        {
          _id: user1.user.id,
          name: user1.inputFields.name,
        },
        process.env.JWT_RESET_PASSWORD,
        {
          expiresIn: "10m",
        }
      ),
    },
    where: {
      id: user1.user.id,
    },
  })).resetPasswordLink;
  await prisma.updateUser({
    data: {
      isAdmin: true,
    },
    where: {
      id: user2.user.id,
    },
  });
  user1.jwt = generateToken(user1.user.id);
  user2.jwt = generateToken(user2.user.id);
};

export { createSeedDatabase, user1, user2 };
