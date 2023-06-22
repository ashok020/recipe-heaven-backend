import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    passwordHash: { type: String, required: true },
    age: { type: Number },
    gender: {
      type: String,
      required: true,
      default: "male",
    },
    myRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    likedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  { timestamps: true }
);

// Pre hook to convert the name fields to lowercase before saving
userSchema.pre("save", function (next) {
  this.name = this.name.replace(/\b\w/g, (match) => match.toUpperCase()); // making first letter captial
  this.email = this.email.toLowerCase();
  this.gender = this.gender.toLowerCase();
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
