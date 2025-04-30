const express = require("express");
const router = express.Router();
const Cocktail = require("../models/Cocktail");

router.get("/", async (req, res) => {
    const cocktails = await Cocktail.find();
    res.json(cocktails);
});

router.get("/:id", async (req, res) => {
    const cocktail = await Cocktail.findById(req.params.id);
    res.json(cocktail);
});

router.post("/", async (req, res) => {
    try {
        const { name, image, ingredients, recipe, theme, description } = req.body;

        const newCocktail = new Cocktail({
            name,
            image,
            ingredients,
            recipe,
            theme,
            description,
        });

        await newCocktail.save();
        res.status(201).json(newCocktail);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
