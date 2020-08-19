import { Query } from "./Query";
import { User } from "./User";
import { Mutation } from "./Mutation";
import {
  AuthPayload,
  signupInput,
  loginInput,
  updateUserInput,
  ActivationPayload,
  resetPasswordInput,
} from "./Auth";
export const resolvers = {
  Query,
  Mutation,
  User,
  AuthPayload,
  ActivationPayload,
  signupInput,
  resetPasswordInput,
  loginInput,
  updateUserInput,
};
