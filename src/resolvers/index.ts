import { Query } from "./Query";
import { User } from "./User";
import { Mutation } from "./Mutation";
import {
  AuthPayload,
  signupInput,
  loginInput,
  updateUserInput,
  deleteUserInput,
  messagePayload,
  resetPasswordInput,
} from "./Auth";
export const resolvers = {
  Query,
  Mutation,
  User,
  AuthPayload,
  messagePayload,
  signupInput,
  resetPasswordInput,
  loginInput,
  updateUserInput,
  deleteUserInput,
};
