# Recipe Haven Web App Backend

This is the backend implementation of the Recipe Haven web application. It provides APIs for user authentication, user registration, fetching recipe data, saving user-created recipes, and generating recipes using Chat GPT.

#### Created for Ecowiser FSD Task.

## Folder Structure

- `config/`: Stores the configuration settings for the backend.
- `controllers/`: Contains the controller files for handling different routes.
- `middleware/`: Contains custom middleware files.
- `models/`: Contains the database models for users and recipes.
- `routes/`: Contains the route files for defining the API endpoints.

## Routes

### Authentication Routes

- `POST /login`: Authenticates a user by validating credentials and returns a JWT-encoded response for subsequent requests.
- `POST /register`: Registers a new user by creating a user account with the provided information.

### User Routes

- `GET /user`: Retrieves the authenticated user's information.
- `PUT /user`: Updates the authenticated user's information.

### Recipe Routes

- `GET /recipes`: Retrieves a list of recipes.
- `GET /recipes/:id`: Retrieves details of a specific recipe based on its ID.
- `GET /recipes/:id/comments`: Retrieves comments for a specific recipe.
- `POST /recipes`: Creates a new recipe.
- `PUT /recipes/:id`: Updates an existing recipe.
- `DELETE /recipes/:id`: Deletes a recipe.
- `POST /recipes/:id/like`: Likes a recipe.
- `DELETE /recipes/:id/like`: Unlikes a recipe.
- `POST /recipes/:id/comment`: Adds a comment to a recipe.
- `DELETE /recipes/:id/comment/:comment_id`: Deletes a comment from a recipe.
- `POST /recipes/generate`: Generates a new recipe using `Chat GPT`.
- `POST /recipes/generate-save`: Utitlity for filling reciepe databse, Generates an Array of recipes using `Chat GPT` and saves them .

## Features

- User SignUp / SingIn
- save user using `JWT tokens` and `localStarage`
- Create New Recipe
- Generate recipe with ingredients or recipe title Using `Chat GPT`
- Edit, Delete Recipes
- Search Recipes
- Like and comments on a recipes
- Post Recipes as Publicly or Privately
- User Info Updatation

## Tech Stack

- Node JS
- ExpressJS
- MongoDB
- JWT
- OpenAI API (Chat GPT API)
- Axios
