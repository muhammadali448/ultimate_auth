import { inputObjectType, objectType } from "nexus";
export const signupInput = inputObjectType({
  name: "signupInput",
  definition(t) {
    t.string("name", { nullable: false });
    t.string("email", { nullable: false });
    t.string("password", { nullable: false });
  },
});

export const resetPasswordInput = inputObjectType({
  name: "resetPasswordInput",
  definition(t) {
    t.string("resetPasswordLink", { nullable: false });
    t.string("newPassword", { nullable: false });
  },
});

export const loginInput = inputObjectType({
  name: "loginInput",
  definition(t) {
    t.string("email", { nullable: false });
    t.string("password", { nullable: false });
  },
});

export const updateUserInput = inputObjectType({
  name: "UpdateUserInput",
  definition(t) {
    t.string("email");
    t.string("password");
    t.string("name");
  },
});

export const deleteUserInput = inputObjectType({
  name: "DeleteUserInput",
  definition(t) {
    t.list.id("id", { required: true });
  },
});

export const messagePayload = objectType({
  name: "MessagePayload",
  definition(t) {
    t.string("message", { nullable: false });
  },
});

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("token", { nullable: false });
    t.field("user", {
      type: "User",
      nullable: false,
    });
  },
});
