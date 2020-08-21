import { gql } from "@apollo/client";
const createUser = gql`
  mutation($data: signupInput!) {
    signup(signupInput: $data) {
      message
    }
  }
`;
const loginUser = gql`
  mutation($data: loginInput!) {
    login(loginInput: $data) {
      token
      user {
        id
        name
        email
        isAdmin
      }
    }
  }
`;
const getUsers = gql`
  query {
    allUsers {
      id
      name
      email
      isAdmin
    }
  }
`;
const getUsersError = gql`
  query {
    allUser {
      i
      name
      email
    }
  }
`;
const currentUser = gql`
  query {
    currentUser {
      id
      name
      email
      isAdmin
    }
  }
`;

const deleteUsers = gql`
  mutation($ids: DeleteUserInput!) {
    deleteUsers(ids: $ids) {
      message
    }
  }
`;

const updateUser = gql`
  mutation($data: UpdateUserInput!) {
    updateUser(updateUserInput: $data) {
      id
      name
      email
      isAdmin
    }
  }
`;

const accountActivation = gql`
  mutation($token: String!) {
    accountActivation(token: $token) {
      message
    }
  }
`;
const forgotPassword = gql`
  mutation($email: String!) {
    forgotPassword(email: $email) {
      message
    }
  }
`;

const resetPassword = gql`
  mutation($data: resetPasswordInput!) {
    resetPassword(resetPasswordInput: $data) {
      message
    }
  }
`;

export {
  createUser,
  accountActivation,
  loginUser,
  getUsers,
  getUsersError,
  currentUser,
  deleteUsers,
  forgotPassword,
  resetPassword,
  updateUser,
};
