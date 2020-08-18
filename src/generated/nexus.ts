/**
 * This file was automatically generated by Nexus 0.11.7
 * Do not make changes to this file directly
 */

import * as types from "../types"


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  createCommentInput: { // input type
    text: string; // String!
  }
  createPostInput: { // input type
    content: string; // String!
    title: string; // String!
  }
  loginInput: { // input type
    email: string; // String!
    password: string; // String!
  }
  signupInput: { // input type
    email: string; // String!
    name: string; // String!
    password: string; // String!
  }
  updateCommentInput: { // input type
    text?: string | null; // String
  }
  updatePostInput: { // input type
    content?: string | null; // String
    isPublished?: boolean | null; // Boolean
    title?: string | null; // String
  }
  updateUserInput: { // input type
    email?: string | null; // String
    name?: string | null; // String
    password?: string | null; // String
  }
}

export interface NexusGenEnums {
  CommentOrderByInput: "createdAt_ASC" | "createdAt_DESC" | "text_ASC" | "text_DESC"
  MutationType: "CREATED" | "DELETED" | "UPDATED"
}

export interface NexusGenRootTypes {
  AuthPayload: { // root type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Comment: { // root type
    createdAt: any; // DateTime!
    id: string; // ID!
    text: string; // String!
    updatedAt: any; // DateTime!
  }
  CommentSubscriptionPayload: { // root type
    mutation: NexusGenEnums['MutationType']; // MutationType!
    node?: NexusGenRootTypes['Comment'] | null; // Comment
  }
  Mutation: {};
  Post: { // root type
    content?: string | null; // String
    createdAt: any; // DateTime!
    id: string; // ID!
    isPublished: boolean; // Boolean!
    title: string; // String!
  }
  PostSubscriptionPayload: { // root type
    mutation: NexusGenEnums['MutationType']; // MutationType!
    node?: NexusGenRootTypes['Post'] | null; // Post
  }
  Query: {};
  Subscription: {};
  User: { // root type
    email: string; // String!
    id: string; // ID!
    name: string; // String!
    password: string; // String!
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  createCommentInput: NexusGenInputs['createCommentInput'];
  createPostInput: NexusGenInputs['createPostInput'];
  loginInput: NexusGenInputs['loginInput'];
  signupInput: NexusGenInputs['signupInput'];
  updateCommentInput: NexusGenInputs['updateCommentInput'];
  updatePostInput: NexusGenInputs['updatePostInput'];
  updateUserInput: NexusGenInputs['updateUserInput'];
  CommentOrderByInput: NexusGenEnums['CommentOrderByInput'];
  MutationType: NexusGenEnums['MutationType'];
}

export interface NexusGenFieldTypes {
  AuthPayload: { // field return type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Comment: { // field return type
    author: NexusGenRootTypes['User']; // User!
    createdAt: any; // DateTime!
    id: string; // ID!
    post: NexusGenRootTypes['Post']; // Post!
    text: string; // String!
    updatedAt: any; // DateTime!
  }
  CommentSubscriptionPayload: { // field return type
    mutation: NexusGenEnums['MutationType']; // MutationType!
    node: NexusGenRootTypes['Comment'] | null; // Comment
  }
  Mutation: { // field return type
    createComment: NexusGenRootTypes['Comment']; // Comment!
    createPost: NexusGenRootTypes['Post']; // Post!
    deleteComment: NexusGenRootTypes['Comment']; // Comment!
    deletePost: NexusGenRootTypes['Post']; // Post!
    deleteUser: NexusGenRootTypes['User']; // User!
    login: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    signup: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    updateComment: NexusGenRootTypes['Comment']; // Comment!
    updatePost: NexusGenRootTypes['Post']; // Post!
    updateUser: NexusGenRootTypes['User']; // User!
  }
  Post: { // field return type
    author: NexusGenRootTypes['User']; // User!
    comments: NexusGenRootTypes['Comment'][] | null; // [Comment!]
    content: string | null; // String
    createdAt: any; // DateTime!
    id: string; // ID!
    isPublished: boolean; // Boolean!
    title: string; // String!
  }
  PostSubscriptionPayload: { // field return type
    mutation: NexusGenEnums['MutationType']; // MutationType!
    node: NexusGenRootTypes['Post'] | null; // Post
  }
  Query: { // field return type
    allComments: NexusGenRootTypes['Comment'][]; // [Comment!]!
    allPosts: NexusGenRootTypes['Post'][]; // [Post!]!
    allUsers: NexusGenRootTypes['User'][]; // [User!]!
    myPosts: NexusGenRootTypes['Post'][]; // [Post!]!
    myProfile: NexusGenRootTypes['User']; // User!
    postById: NexusGenRootTypes['Post']; // Post!
  }
  Subscription: { // field return type
    comments: NexusGenRootTypes['CommentSubscriptionPayload']; // CommentSubscriptionPayload!
    posts: NexusGenRootTypes['PostSubscriptionPayload']; // PostSubscriptionPayload!
  }
  User: { // field return type
    comments: NexusGenRootTypes['Comment'][] | null; // [Comment!]
    email: string; // String!
    id: string; // ID!
    name: string; // String!
    password: string; // String!
    posts: NexusGenRootTypes['Post'][] | null; // [Post!]
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createComment: { // args
      createCommentInput: NexusGenInputs['createCommentInput']; // createCommentInput!
      postId: string; // ID!
    }
    createPost: { // args
      createPostInput: NexusGenInputs['createPostInput']; // createPostInput!
    }
    deleteComment: { // args
      id: string; // ID!
    }
    deletePost: { // args
      id: string; // ID!
    }
    deleteUser: { // args
      id: string; // ID!
    }
    login: { // args
      loginInput: NexusGenInputs['loginInput']; // loginInput!
    }
    signup: { // args
      signupInput: NexusGenInputs['signupInput']; // signupInput!
    }
    updateComment: { // args
      id: string; // ID!
      updateCommentInput: NexusGenInputs['updateCommentInput']; // updateCommentInput!
    }
    updatePost: { // args
      id: string; // ID!
      updatePostInput: NexusGenInputs['updatePostInput']; // updatePostInput!
    }
    updateUser: { // args
      updateUserInput: NexusGenInputs['updateUserInput']; // updateUserInput!
    }
  }
  Query: {
    allComments: { // args
      orderBy?: NexusGenEnums['CommentOrderByInput'] | null; // CommentOrderByInput
    }
    allPosts: { // args
      searchString?: string | null; // String
    }
    allUsers: { // args
      searchNameString?: string | null; // String
    }
    myPosts: { // args
      searchString?: string | null; // String
    }
    postById: { // args
      id: string; // ID!
    }
  }
  Subscription: {
    comments: { // args
      id: string; // ID!
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "AuthPayload" | "Comment" | "CommentSubscriptionPayload" | "Mutation" | "Post" | "PostSubscriptionPayload" | "Query" | "Subscription" | "User";

export type NexusGenInputNames = "createCommentInput" | "createPostInput" | "loginInput" | "signupInput" | "updateCommentInput" | "updatePostInput" | "updateUserInput";

export type NexusGenEnumNames = "CommentOrderByInput" | "MutationType";

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "DateTime" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: types.Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}