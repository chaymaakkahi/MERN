
 // Données isolées dans le contrôleur (en mémoire pour cette séance)
let users = [
    { id: 1, name: 'Islem', email: 'Islem@gmail.com', role: 'admin' },
    { id: 2, name: 'chiheb', email: 'chiheb@gmail.com', role: 'user' }
];

let prochainId = 3;

const { estNonVide, estEmailValide } = require('../utils/validators');

const getAllUsers = (req, res) => {
    const { role } = req.query;
    let resultat = users;

    if (role) {
        resultat = users.filter(u => u.role === role);
    }

    res.status(200).json({
        total: resultat.length,
        users: resultat
    });
};

const getUserById = (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            error: `Utilisateur ${id} introuvable`
        });
    }

    res.status(200).json(user);
};

const createUser = (req, res) => {
    const { name, email, role } = req.body;

    // Vérifier que le nom n'est pas vide
    if (!estNonVide(name)) {
        return res.status(400).json({
            error: "Le nom est obligatoire et ne doit pas être vide"
        });
    }

    // Vérifier que l'email est valide
    if (!estEmailValide(email)) {
        return res.status(400).json({
            error: "L'email est invalide et doit contenir @ et ."
        });
    }

    const nouvelUtilisateur = {
        id: prochainId++,
        name,
        email,
        role: role || 'user'
    };

    users.push(nouvelUtilisateur);

    res.status(201).json({
        message: "Utilisateur créé",
        user: nouvelUtilisateur
    });
};

const deleteUser = (req, res) => {
    const id = Number(req.params.id);

    const userExiste = users.some(u => u.id === id);

    if (!userExiste) {
        return res.status(404).json({
            error: `Impossible de supprimer : utilisateur ${id} introuvable`
        });
    }

    users = users.filter(u => u.id !== id);

    res.status(200).json({
        message: `Utilisateur ${id} supprimé avec succès`
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser
};