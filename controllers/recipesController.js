import { getChatGptResponse } from "../utils/getChatGptResponse.js";
import Recipe from "../models/Recipe.js";
import { getDecodedUserToken } from "../utils/usersUtils.js";
import User from "../models/User.js";
import { formatRecipes } from "../utils/formatRecipes.js";
import { applyPagination } from "../utils/applyPagination.js";

export async function getRecipes(req, res) {
//  console.log("query: ", req.query);
  var {
    search,
    page = 1,
    limit = 10,
    sort = "desc",
    my = false,
    liked = false,
  } = req.query;
  search = search.trim();
  const decodedToken = getDecodedUserToken(req.headers.authorization);
  var user_id = null;
  if (decodedToken) user_id = decodedToken._id;
  let query = { "content.isPublic": true };
  if (my) {
    if (!user_id) {
      return res.status(400).json({ error: "User is not authorized" });
    }
    query = { createdBy: user_id };
  }
  try {
    if (search !== null && search !== undefined) {
      const regex = new RegExp(search, "i");
      query["content.title"] = regex;
    }
    let recipes;
    if (liked) {
      const user = await User.findById(user_id).select("likedRecipes");
      const likedRecipesIds = user.likedRecipes;
      recipes = await Recipe.find({
        _id: { $in: likedRecipesIds },
        ...query,
      }).populate({
        path: "createdBy",
        select: "username gender name",
      });
    } else {
      recipes = await Recipe.find(query).populate({
        path: "createdBy",
        select: "username gender name",
      });
    }

    const formattedRecipes = formatRecipes(recipes, user_id);
    const paginatedRecipes = applyPagination(formattedRecipes, {
      page,
      limit,
      sort,
    });

    res.status(200).json(paginatedRecipes);
  } catch (err) {
//    console.log("Error during getting recipes: ", err);
    res.status(500).json({ error: "An error occurred while fetching recipes" });
  }
}

export async function getRecipe(req, res) {
  const { id } = req.params;
  var user_id = getDecodedUserToken(req.headers.authorization);
  if (user_id) user_id = user_id._id;
  try {
    const recipe = await Recipe.findOne({
      recipeId: id,
      $or: [
        {
          "content.isPublic": true,
        },
        {
          createdBy: user_id,
        },
      ],
    }).populate({
      path: "createdBy",
      select: "username gender name",
    });
    if (!recipe) return res.status(400).json({ error: "Recipe not found" });
    res.status(200).json({
      recipe: recipe.content,
      createdBy: {
        username: recipe.createdBy.username,
        name: recipe.createdBy.name,
        gender: recipe.createdBy.gender,
      },
      liked: recipe.likes.includes(user_id),
      likesCount: recipe.likes.length,
      commentsCount: recipe.comments.length,
    });
  } catch (err) {
//    console.log("Erorr during getting recipe ", err);
    res.status(500).json({ error: "An error occurred while fetching recipe" });
  }
}

export async function getComments(req, res) {
//  console.log("query: ", req.query);
  const { id } = req.params;
//  console.log(id);
  const { page = 1, limit = 10, sort = "desc" } = req.query;
  try {
    const recipe = await Recipe.findOne(
      { recipeId: id },
      { comments: 1 }
    ).populate({
      path: "comments.user",
      select: "username gender name",
    });

    const comments = recipe.comments.map((comment) => ({
      commentId: comment.commentId,
      user: {
        username: comment.user.username,
        gender: comment.user.gender,
        name: comment.user.name,
      },
      text: comment.text,
      createdAt: comment.createdAt,
    }));

    const paginatedComments = applyPagination(comments, { page, limit, sort });
    res
      .status(200)
      .json({ ...paginatedComments, totalComments: comments.length });
  } catch (err) {
//    console.log("Error during getting comments: ", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching comments" });
  }
}

export async function createRecipe(req, res) {
//  console.log(req.body);
  const {
    title,
    description,
    ingredients,
    steps,
    time,
    image,
    serves,
    isPublic = true,
  } = req.body;
  if (!title || !ingredients || !steps)
    return res.status(400).json({ error: "Missing required fields" });
  const user_id = getDecodedUserToken(req.headers.authorization)._id;
  const content = {
    title,
    description,
    ingredients,
    steps,
    time,
    isPublic,
    serves,
  };
  if (image)
    content.image = {
      data: Buffer.from(image.data),
      contentType: image.contentType,
    };
  const recipe = new Recipe({
    content,
    createdBy: user_id,
  });
  try {
    if (await Recipe.findOne({ title, createdBy: user_id }))
      // if already same recpie by same user exist
      return res
        .status(400)
        .json({ error: "Recipe already exists can't use POST" });
//    console.log(recipe);
    const recipeObj = await recipe.save();
    await User.findOneAndUpdate(
      {
        _id: user_id,
      },
      {
        $addToSet: {
          myRecipes: recipeObj._id,
        },
      }
    );
//    console.log("Recipe created successfully with id : ", recipe.recipeId);
    res.status(200).json({ message: "recipe created", id: recipe.recipeId });
  } catch (err) {
//    console.log("Erorr during saving recipe ", err);
    res.status(500).json({ error: "An error occurred during recipe creation" });
  }
}

export async function updateRecipe(req, res) {
  const { id } = req.params;
  const {
    title,
    description,
    ingredients,
    steps,
    time,
    image,
    serves,
    isPublic,
  } = req.body;
  const user_id = getDecodedUserToken(req.headers.authorization)._id;
  try {
    const recipe = await Recipe.findOne({ recipeId: id, createdBy: user_id });
    if (!recipe) return res.status(400).json({ error: "Recipe not found" });
    // update the recipe with the given recepieId : id , createdBy : user_id , and only fields which are not null
    const content = recipe.content;
    if (title != null || title != undefined) content.title = title;
    if (description != null || description != undefined)
      content.description = description;
    if (ingredients != null || ingredients != undefined)
      content.ingredients = ingredients;
    if (steps != null || steps != undefined) content.steps = steps;
    if (time != null || time != undefined) content.time = time;
    if (image != null || image != undefined) content.image = image;
    if (isPublic != null || isPublic != undefined)
      content.isPublic = !!isPublic;
    if (serves != null || serves != undefined) content.serves = serves;
    await Recipe.findOneAndUpdate({ recipeId: id }, { content: content });
//    console.log("Recipe updated successfully");
    res.status(200).json({ message: "Recipe updated" });
  } catch (err) {
//    console.log("Erorr during updating recipe ", err);
    res.status(500).json({ error: "An error occurred while updating recipe" });
  }
}
export async function deleteRecipe(req, res) {
  const { id } = req.params;
  const user_id = getDecodedUserToken(req.headers.authorization)._id;

  try {
    const recipe = await Recipe.findOneAndRemove({
      recipeId: id,
      createdBy: user_id,
    });
    if (!recipe) {
//      console.log("Recipe not found");
      return res
        .status(400)
        .json({ error: "Recipe not found under this user" });
    }

    // Remove the recipe ID from the myRecipes and likedRecipes(if exists)
    await User.findOneAndUpdate(
      { _id: user_id },
      {
        $pull: { myRecipes: recipe._id, likedRecipes: recipe._id },
      }
    );

//    console.log("Recipe deleted successfully");
    res.status(200).json({ message: "Recipe deleted" });
  } catch (err) {
//    console.log("Erorr during deleting recipe ", err);
    res.status(500).json({ error: "An error occurred while deleting recipe" });
  }
}

export async function likeRecipe(req, res) {
  const { id } = req.params;
  const user_id = getDecodedUserToken(req.headers.authorization)._id;

  try {
    const recipe = await Recipe.findOneAndUpdate(
      { recipeId: id },
      { $addToSet: { likes: user_id } }
    );
    const user = await User.findOneAndUpdate(
      { _id: user_id },
      { $addToSet: { likedRecipes: recipe._id } }
    );
    if (!recipe || !user) {
//      console.log("Unable to like recipe");
      return res.status(400).json({ error: "Unable to like recipe" });
    }
//    console.log("Recipe liked successfully");
    res.status(200).json({ message: "Recipe liked" });
  } catch (err) {
//    console.log("Erorr during liking recipe ", err);
    res.status(500).json({ error: "An error occurred while liking recipe" });
  }
}

export async function unlikeRecipe(req, res) {
  const { id } = req.params;
  const user_id = getDecodedUserToken(req.headers.authorization)._id;

  try {
    const recipe = await Recipe.findOneAndUpdate(
      { recipeId: id },
      { $pull: { likes: user_id } }
    );
    const user = await User.findOneAndUpdate(
      { _id: user_id },
      { $pull: { likedRecipes: recipe._id } }
    );
    if (!recipe || !user) {
//      console.log("Unable to unlike recipe");
      return res.status(400).json({ error: "Unable to unlike recipe" });
    }
//    console.log("Recipe unliked successfully");
    res.status(200).json({ message: "Recipe unliked" });
  } catch (err) {
//    console.log("Erorr during unliking recipe ", err);
    res.status(500).json({ error: "An error occurred while unliking recipe" });
  }
}

export async function commentRecipe(req, res) {
  const { id } = req.params;
  const { text } = req.body;
//  console.log(text);
  const user_id = getDecodedUserToken(req.headers.authorization)._id;
  if (!text) return res.status(400).json({ error: "Comment is required" });
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { recipeId: id },
      { $push: { comments: { user: user_id, text: text } } }
    );
    if (!recipe) {
//      console.log("Recipe not found");
      return res.status(400).json({ error: "Recipe not found" });
    }

//    console.log("Recipe commented successfully");
    res.status(200).json({ message: "Recipe commented" });
  } catch (err) {
//    console.log("Erorr during commenting recipe ", err);
    res
      .status(500)
      .json({ error: "An error occurred while commenting recipe" });
  }
}

export async function deleteComment(req, res) {
  const { id, comment_id } = req.params;
  const user_id = getDecodedUserToken(req.headers.authorization)._id;
  try {
    const recipe = await Recipe.findOneAndUpdate(
      {
        recipeId: id,
        "comments.commentId": comment_id,
        "comments.user": user_id,
      },
      { $pull: { comments: { commentId: comment_id, user: user_id } } }
    );
    if (!recipe) {
//      console.log("Recipe or comment with this user not found");
      return res
        .status(400)
        .json({ error: "Recipe or comment with this user not found" });
    }
//    console.log("Comment deleted successfully");
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
//    console.log("Erorr during deleting comment ", err);
    res.status(500).json({ error: "An error occurred while deleting comment" });
  }
}

export async function generateRecipe(req, res) {
  const { keywords } = req.query;
  if (!keywords || keywords.length < 4)
    return res.status(200).json({
      found: false,
      content: "I am unable to generate!, Try refining your keywords",
    });
  const results = await getChatGptResponse(keywords);
  res.status(200).json(results);
}

export async function generateAndSaveRecipe(req, res) {
  try {
    var { titles } = req.body;
    const user_id = getDecodedUserToken(req.headers.authorization)._id;
    if (!titles) {
      titles = [
        "Masala Dosa",
        "Paneer Tikka",
        "Chole Bhature",
        "Palak Paneer",
        "Aloo Paratha",
        "Rajma Chawal",
        "Pav Bhaji",
        "Malai Kofta",
        "Pani Puri (Gol Gappa)",
        "Matar Paneer",
        "Vegetable Pulao",
        "Dahi Vada",
        "Rogan Josh",
        "Margherita Pizza",
        "Spinach and Feta Quiche",
        "Greek Salad",
        "Tiramisu",
        "Pad Thai",
        "Caprese Salad",
        "Mango Lassi (Indian-inspired shake)",
        "Strawberry Banana Smoothie",
        "Classic Mojito",
        "Chocolate Milkshake",
        "Mango Coconut Pudding",
      ];
    }

//    console.log("generating and saving recipes", titles);
    const recipes = [];
    for (const t of titles) {
      try {
        const recipe = await getChatGptResponse(t);
        const { title, description, ingredients, steps, time, serves } =
          recipe.content;
//        console.log("Recipe found? ", recipe.found);
        if (recipe.found) {
//          console.log("Generated recipe", { title, description });
          recipes.push(recipe);
          const recipeObj = {
            content: {
              title: title,
              description,
              ingredients,
              steps,
              time,
              serves,
              image: "",
              isPublic: true,
            },
            createdBy: user_id,
          };

          const recipeModel = new Recipe(recipeObj);
          await recipeModel.save();

          await User.findOneAndUpdate(
            { _id: user_id },
            { $addToSet: { myRecipes: recipeModel._id } }
          );
        }
      } catch (err) {
//        console.log(err);
      }
    }

    // Return a response indicating success
    res.status(200).json({
      message: "Recipes generated and saved successfully",
      recipes: recipes,
    });
  } catch (err) {
    // Handle any errors that occurred during the process
//    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
