export function formatRecipes(recipes) {
  return recipes.map((recipe) => ({
    recipeId: recipe.recipeId,
    title: recipe.content.title,
    description: recipe.content.description,
    likesCount: recipe.likes.length,
    commentsCount: recipe.comments.length,
    image: recipe.content.image,
    createdBy: {
      username: recipe.createdBy.username,
      gender: recipe.createdBy.gender,
    },
    createdAt: recipe.createdAt,
  }));
}
