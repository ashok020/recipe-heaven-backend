# Recipe-haven webapp backend

This is the backend implementation of the Recipe Haven web application. It provides APIs for user authentication, user registration, fetching recipe data, saving user-created recipes, and generating recipes using Chat GPT.

Created for Ecowiser FSD Task.

## My Process

- Designed the basic plan of how my folder structure will look and what necessary files should be.

Defined Folder Structure:

- `config`: Stores the configuration settings for the backend.
- `controllers/`: Contains the controller files for handling different routes.
- `middleware/`: Contains custom middleware files.
- `models/`: Contains the database models for users and recipes.
- `routes/`: Contains the route files for defining the API endpoints.

- Created the following routes:

  - `POST /login`: Authenticates a user and returns a JWT-encoded response.
  - `POST /register`: Registers a new user.

  Protected routes (only accessible when the user is authenticated):

  - `GET /user`: Retrieves the authenticated user's information.
  - `/recipes`: Recipe related paths :
    - `POST /recipes`,`POST /recipes`,`GET,PUT,DELETE, /recipes/:id`,`PUT /recipes/:id/like`,`PUT /recipes/:id/unlike`,`POST /recipes/:id/comment`,`GET /recipes/generate`

- Designed the MongoDB model schema for users and recipes.

Please refer to the respective files in the project for detailed implementation.
