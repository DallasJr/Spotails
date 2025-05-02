const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyAdmin = require('../middleware/verifyAdmin');

router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.delete("/:id", verifyAdmin, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
});

router.put("/:id", verifyAdmin, async (req, res) => {
    const { role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ message: "Rôle mis à jour" });
});

module.exports = router;
