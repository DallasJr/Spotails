const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        const token = generateToken(user._id, user.role);
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token,
        });
    } else {
        res.status(400).json({ message: "Erreur lors de l'inscription" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.role);
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token,
        });
    } else {
        res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
};

module.exports = { registerUser, loginUser };
