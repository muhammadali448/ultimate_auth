import { verify } from "jsonwebtoken";
import { Context } from "../types";
interface Token {
  userId: string;
}
export const getUserId = (context: Context, isAuthRequired = true) => {
  const authTokenWithBarer = context.request.request
    ? context.request.request.headers.authorization
    : context.request.connection.context.Authorization;
  if (authTokenWithBarer) {
    const token = authTokenWithBarer.split(" ")[1];
    const user = verify(token, process.env.JWT_SECRET) as Token;
    console.log(user.userId);
    return user.userId;
  }
  return null;
};
