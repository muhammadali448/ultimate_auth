import { Query } from "./Query";
import { User } from "./User";
import { Mutation } from "./Mutation";
import {
  AuthPayload,
  signupInput,
  loginInput,
  ActivationPayload,
} from "./Auth";
export const resolvers = {
  Query,
  Mutation,
  User,
  AuthPayload,
  ActivationPayload,
  signupInput,
  loginInput,
};
