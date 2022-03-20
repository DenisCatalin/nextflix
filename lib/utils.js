import jwt from "jsonwebtoken";

export async function verifyToken(token) {
  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY_HASURA);

    const userId = decodedToken.issuer;
    return userId;
  }

  return null;
}
