import { Prisma } from "./generated/prisma-client";

export interface Context {
  prisma: Prisma;
  request: {
    request: {
      headers: {
        authorization: string;
      };
    };
    connection: {
      context: {
        Authorization: string;
      };
    };
  };
}
