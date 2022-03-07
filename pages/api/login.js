import { magicAdmin } from "../../lib/magic";
import jwt from "jsonwebtoken";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substr(7) : "";
      console.log({ token });
      res.send({ done: true });
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);
      console.log({ metadata });

      //create jwt token

      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Mayh.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        process.env.PUBLIC_NEXT_SECRET_KEY_HASURA
      );

      console.log({ token });
    } catch (err) {
      console.error("Something went wrong", err);
      res.status(500).send({ done: false });
    }
  } else {
    res.status(500).send({ done: false });
  }
}
