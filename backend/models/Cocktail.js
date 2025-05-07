const mongoose = require("mongoose");

const cocktailSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    thumbnail: { type: String, required: true },
    ingredients: { type: [String], required: true },
    recipe: { type: String, required: true },
    theme: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, default: "#1ED760", required: true },
});

module.exports = mongoose.model("Cocktail", cocktailSchema);
