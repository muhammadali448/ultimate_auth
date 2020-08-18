import { gql } from "@apollo/client";
const createUser = gql`
  mutation($data: signupInput!) {
    signup(signupInput: $data) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;
const loginUser = gql`
  mutation($data: loginInput!) {
    login(loginInput: $data) {
      token
    }
  }
`;
const getUsers = gql`
  query {
    allUsers {
      id
      name
      email
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
    myProfile {
      id
      name
      email
    }
  }
`;

const deleteUser = gql`
  mutation($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const updateUser = gql`
  mutation($data: updateUserInput!) {
    updateUser(updateUserInput: $data) {
      id
      name
      password
    }
  }
`;


export { createUser, loginUser, getUsers, getUsersError, getProfile, deleteUser, updateUser };
