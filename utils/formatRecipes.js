export function formatRecipes(recipes, user_id) {
  return recipes.map((recipe) => formatRecipesHelper(recipe, user_id));
}

function formatRecipesHelper(recipe, user_id) {
  var isLiked = false;
  if (user_id && recipe.likes.includes(user_id)) isLiked = true;
  return {
    recipeId: recipe.recipeId,
    title: recipe.content.title,
    description: recipe.content.description,
    likesCount: recipe.likes.length,
    commentsCount: recipe.comments.length,
    image: recipe.content.image,
    createdBy: {
      username: recipe.createdBy.username,
      gender: recipe.createdBy.gender,
      name: recipe.createdBy.name,
    },
    createdAt: recipe.createdAt,
    isLiked: isLiked,
  };
}
