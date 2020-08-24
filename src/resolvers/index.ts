import { Query } from "./Query";
import { User } from "./User";
import { Mutation } from "./Mutation";
import {
  AuthPayload,
  signupInput,
  loginInput,
  facebookLoginInput,
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
  facebookLoginInput,
  messagePayload,
  signupInput,
  resetPasswordInput,
  loginInput,
  updateUserInput,
  deleteUserInput,
};
