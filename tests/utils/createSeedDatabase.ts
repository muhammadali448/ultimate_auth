import { prisma } from "../../src/generated/prisma-client";
import { hashSync } from "bcrypt";
import { sign } from "jsonwebtoken";
const user1 = {
  inputFields: {
    name: "John Smith",
    email: "john_smith222@gmail.com",
    password: hashSync("hello123", 10),
  },
  user: undefined as any,
  jwt: undefined as string,
};

const user2 = {
  inputFields: {
    name: "Will Boogieman",
    email: "will222@gmail.com",
    password: hashSync("will123", 10),
  },
  user: undefined as any,
  jwt: undefined as string,
};

const createSeedDatabase = async () => {
  jest.setTimeout(10000);
  await prisma.deleteManyUsers();
  await prisma.deleteManyPosts();
  user1.user = await prisma.createUser({
    ...user1.inputFields,
  });
  user2.user = await prisma.createUser({
    ...user2.inputFields,
  });
  user1.jwt = sign({ userId: user1.user.id }, process.env.JWT_SECRET);
  user2.jwt = sign({ userId: user2.user.id }, process.env.JWT_SECRET);
};

export { createSeedDatabase, user1, user2 };
