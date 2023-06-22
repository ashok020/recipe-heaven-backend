import { validateJWT } from "../utils/jwtUtils.js";
import User from "../models/User.js";
export async function isAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  console.log(
    token ? `Received Token : ${token}` : "token not passed in header"
  );
  const validated = validateJWT(token);
  if (
    !validated._id ||
    !User.findOne({
      _id: validated._id,
      username: validated.username,
      email: validated.email,
    })
  )
    return res.status(401).json({ error: "Unauthorized" });
  if (validated.error) {
    return res.status(401).json({ error: validated.error });
  } else next();
}
