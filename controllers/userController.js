const User = require('../models/userModel');
const Article = require('../models/articleModel');

// 1. Create a new user (POST /api/users)
const createUser = async (req, res) => {
    try {
        const { name, email, age, role } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: 'Name and email are required'
            });
        }

        // Check for duplicate email
        const exists = await User.findOne({ email });

        if (exists) {
            return res.status(409).json({
                message: 'Email already in use'
            });
        }

        const user = await User.create({
            name,
            email,
            age,
            role
        });

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// 2. Retrieve all users (GET /api/users)
const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// 3. Retrieve a user by ID (GET /api/users/:id)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json(user);
   }catch (err) {
        // Check whether the ID format is invalid
        if (err.name === 'CastError') {
            return res.status(400).json({
                message: 'Identifiant de ressource invalide (format ObjectId attendu)'
            });
        }

        // Handle other unexpected errors
        return res.status(500).json({
            message: err.message
        });
    }
};

//Delete a user by ID (DELETE /api/users/:id)

const deleteUser = async (req, res) => {
    try {
        // Check whether the user has published articles
        const article = await Article.findOne({
            author: req.params.id
        });

        // If an article exists, prevent user deletion
        if (article) {
            return res.status(400).json({
                message: "Impossible de supprimer un utilisateur ayant des articles publies"
            });
        }

        // Otherwise, delete the user
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable"
            });
        }

        return res.status(200).json({
            message: "Utilisateur supprimé avec succès"
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    deleteUser
};