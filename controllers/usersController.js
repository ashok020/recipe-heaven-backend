import { getDecodedUserToken } from "../utils/usersUtils.js";
import User from "../models/User.js";
import { applyPagination } from "../utils/applyPagination.js";
import { formatRecipes } from "../utils/formatRecipes.js";

export async function getUser(req, res) {
  const user_id = getDecodedUserToken(req.headers.authorization);
  if (!user_id) return res.status(400).json({ error: "User not found" });
  try {
    const user = await User.findOne({ _id: user_id });
    if (!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json({
      username: user.username,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      likedRecipesCount: user.likedRecipes.length,
      myRecipesCount: user.myRecipes.length,
    });
  } catch (err) {
    res.status(500).json({ error: "An error occurred while getting user" });
  }
}

export async function updateUser(req, res) {
  const user_id = getDecodedUserToken(req.headers.authorization);
  if (!user_id) return res.status(400).json({ error: "User not found" });
  try {
    const { name, age, gender } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: user_id },
      { name, age, gender }
    );
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "An error occurred while updating user" });
  }
}

export async function getLikedRecipes(req, res) {
  const user_id = getDecodedUserToken(req.headers.authorization)._id;
  const { page = 1, limit = 10, sort = "desc" } = req.query;
  try {
    const user = await User.findOne({ _id: user_id }).populate("likedRecipes");
    const likedRecipes = formatRecipes(user.likedRecipes);
    const paginatedRecipes = applyPagination(
      { page, limit, sort },
      likedRecipes
    );
    res.status(200).json(paginatedRecipes);
  } catch (err) {
    console.log("Error during getting liked recipes: ", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching liked recipes" });
  }
}

export async function getMyRecipes(req, res) {
  const user_id = getDecodedUserToken(req.headers.authorization)._id;
  const { page = 1, limit = 10, sort = "desc" } = req.query;
  try {
    const user = await User.findOne({ _id: user_id }).populate("myRecipes");
    const myRecipes = formatRecipes(user.myRecipes);
    const paginatedRecipes = applyPagination({ page, limit, sort }, myRecipes);
    res.status(200).json(paginatedRecipes);
  } catch (err) {
    console.log("Error during getting my recipes: ", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching my recipes" });
  }
}
