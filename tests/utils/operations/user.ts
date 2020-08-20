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
const getProfile = gql`
  query {
    createUser {
      id
      name
      email
      isAdmin
    }
  }
`;

const deleteUsers = gql`
  mutation($ids: DeleteUserInput!) {
    deleteUser(ids: $ids) {
      message
    }
  }
`;

const updateUser = gql`
  mutation($data: updateUserInput!) {
    updateUser(updateUserInput: $data) {
      id
      name
      email
      isAdmin
    }
  }
`;

const accountActivation = gql`
  mutation {
    accountActivation(token: String!) {
      message
    }
  }
`;

export {
  createUser,
  loginUser,
  getUsers,
  getUsersError,
  getProfile,
  deleteUsers,
  updateUser,
};
