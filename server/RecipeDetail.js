const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  cuisineType: { type: String, required: true },
  cookingTime: { type: Number, required: true },
});

const Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports = Recipe;
