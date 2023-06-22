import { Router } from "express";
const router = Router();
import {
  getRecipes,
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  commentRecipe,
  deleteComment,
  generateRecipe,
  getComments,
} from "../controllers/recipesController.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { isAuth } from "../middlewares/isAuth.js";

// generate recipe
router.get("/generate", isAuth, asyncErrorHandler(generateRecipe)); // it must be before get /:id

// get with no authorization required
router.get("/", asyncErrorHandler(getRecipes));
router.get("/:id", asyncErrorHandler(getRecipe));
router.get("/:id/comments", asyncErrorHandler(getComments));

// create, get, update, delete Recipe
router.post("/", isAuth, asyncErrorHandler(createRecipe));
router.put("/:id", isAuth, asyncErrorHandler(updateRecipe));
router.delete("/:id", isAuth, asyncErrorHandler(deleteRecipe));

// like, unlike, comment, delete comment
router.post("/:id/like", isAuth, asyncErrorHandler(likeRecipe));
router.delete("/:id/like", isAuth, asyncErrorHandler(unlikeRecipe));
router.post("/:id/comment", isAuth, asyncErrorHandler(commentRecipe));
router.delete(
  "/:id/comment/:comment_id",
  isAuth,
  asyncErrorHandler(deleteComment)
);

export default router;
