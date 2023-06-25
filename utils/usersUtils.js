import Users from "../models/User.js";
import { validateJWT } from "./jwtUtils.js";

// auth related

export function getUserFieldsError({
  name,
  username,
  email,
  age,
  gender,
  password,
}) {
  if (name === "" || username === "" || email === "" || password === "")
    return "Missing required fields";
  if (!username || username.length < 4)
    return "Username must be at least 4 characters long";
  if (!password || password.length < 6)
    return "Password must be at least 6 characters long";
  if (email && !isEmailValid(email)) return "Invalid email";
  if (age && (age < 0 || age > 200)) return "Invalid age";
  if (
    gender &&
    gender.toLowerCase() != "male" &&
    gender &&
    gender.toLowerCase() != "female"
  )
    return "Gender must be either male or female";
  return null;
}

export async function getUseIfExists(username, email) {
  const user = await Users.findOne({
    $or: [{ username: username }, { email: email }],
  });
  return user;
}

function isEmailValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getDecodedUserToken(authHeader) {
  const token = authHeader && authHeader.split(" ")[1];
  console.log({ token });
  const validated = validateJWT(token);
  if (!validated.error) return validated;
  return null;
}
