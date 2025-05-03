const express = require("express");
const router = express.Router();
const verifyAuth = require("../middleware/verifyAuth");
const verifyAdmin = require('../middleware/verifyAdmin');
const userController = require("../controllers/userController");
const User = require("../models/User");

router.put("/update-password", verifyAuth, userController.updatePassword);

router.put("/update-email", verifyAuth, userController.updateEmail);

router.put("/update-username", verifyAuth, userController.updateUsername);

router.delete("/delete-account", verifyAuth, userController.deleteAccount);

router.get("/me", verifyAuth, userController.retrieveAccount);

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
