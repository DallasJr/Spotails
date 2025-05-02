const express = require("express");
const router = express.Router();
const Cocktail = require("../models/Cocktail");
const verifyAdmin = require('../middleware/verifyAdmin');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });
const deleteImage = (filename) => {
    const imagePath = path.join(__dirname, "../uploads", filename);
    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
            if (err) console.error("Erreur suppression image :", err);
        });
    }
};

router.get("/", async (req, res) => {
    const cocktails = await Cocktail.find();
    res.json(cocktails);
});

router.get("/:id", async (req, res) => {
    const cocktail = await Cocktail.findById(req.params.id);
    res.json(cocktail);
});

router.post("/", verifyAdmin, upload.single("image"), async (req, res) => {
    try {
        const { name, ingredients, recipe, theme, description } = req.body;
        if (!name || !req.file || !ingredients || !recipe || !theme || !description) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }
        const newCocktail = new Cocktail({
            name,
            image: req.file.filename,
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

router.put("/:id", verifyAdmin, upload.single("image"), async (req, res) => {
    try {
        const cocktail = await Cocktail.findById(req.params.id);
        if (!cocktail) {
            return res.status(404).json({ message: "Cocktail introuvable." });
        }
        const updateData = { ...req.body };
        if (updateData.ingredients) {
            updateData.ingredients = updateData.ingredients.split(",").map(i => i.trim());
        }
        if (req.file) {
            if (cocktail.image) deleteImage(cocktail.image);
            updateData.image = req.file.filename;
        }
        const updatedCocktail = await Cocktail.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedCocktail) {
            return res.status(404).json({ message: "Cocktail introuvable." });
        }
        res.json(updatedCocktail);
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de la mise à jour." });
    }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
    try {
        const deletedCocktail = await Cocktail.findByIdAndDelete(req.params.id);
        if (!deletedCocktail) return res.status(404).json({ message: "Cocktail introuvable." });

        if (deletedCocktail.image) deleteImage(deletedCocktail.image);
        res.json({ message: "Cocktail supprimé." });
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de la suppression." });
    }
});

module.exports = router;
