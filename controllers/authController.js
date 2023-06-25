import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateJWT } from "../utils/jwtUtils.js";
import { getUseIfExists, getUserFieldsError } from "../utils/usersUtils.js";

export async function checkAuth(req, res) {
  // will come only if the user is authenticated
  res.status(200).json({ message: "Authorized" });
}

export async function login(req, res) {
  var { username, password } = req.body;
  username = username.toLowerCase();
  const validationError = getUserFieldsError({ username, password });
  if (validationError) return res.status(400).json({ error: validationError });
  try {
    const user = await getUseIfExists(username, username);
    if (!user) return res.status(400).json({ error: "User does not exist" });
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch)
      return res.status(400).json({ error: "Invalid password" });
    const token = generateJWT({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error occurred during login:", err);
    res.status(500).json({ error: "An error occurred during login" });
  }
}

export async function register(req, res) {
  var { name, username, email, password, age, gender } = req.body;
  const validationError = getUserFieldsError({
    name,
    username,
    email,
    password,
    age,
    gender,
  });
  username = username.toLowerCase();
  email = email.toLowerCase();
  if (validationError) return res.status(400).json({ error: validationError });
  try {
    if (await getUseIfExists(username, email))
      return res.status(400).json({ error: "User already exists" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      username,
      email,
      passwordHash,
      age,
      gender,
    });
    await user.save();
//    console.log("User registered successfully : ", user);
    res.status(200).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Error occurred during registration:", err);
    res.status(500).json({ error: "An error occurred during registration" });
  }
}
