const mongoose = require("mongoose");

const cocktailSchema = new mongoose.Schema({
    name: String,
    image: String,
    ingredients: [String],
    recipe: String,
    theme: String,
    description: String,
});

module.exports = mongoose.model("Cocktail", cocktailSchema);
