const express = require("express");
const router = express.Router();
const Cocktail = require("../models/Cocktail");
const verifyAdmin = require('../middleware/verifyAdmin');

router.get("/", async (req, res) => {
    const cocktails = await Cocktail.find();
    res.json(cocktails);
});

router.get("/:id", async (req, res) => {
    const cocktail = await Cocktail.findById(req.params.id);
    res.json(cocktail);
});

router.post("/", verifyAdmin, async (req, res) => {
    try {
        const { name, image, ingredients, recipe, theme, description } = req.body;
        if (!name || !image || !ingredients || !recipe || !theme || !description) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }
        const newCocktail = new Cocktail({
            name,
            image,
            ingredients,
            recipe,
            theme,
            description,
        });

        await newCocktail.save();
        return res.status(201).json({ message: 'Cocktail ajouté avec succès', cocktail: newCocktail });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur interne du serveur', error: err.message });
    }
});

module.exports = router;
