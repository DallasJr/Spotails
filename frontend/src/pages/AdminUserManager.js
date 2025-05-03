import React, {useEffect, useState} from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminUserManager = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer ce compte ?")) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                fetchUsers();
            } catch (error) {
                console.error("Erreur lors de la suppression de l'utilisateur", error);
            }
        }
    };

    const handleRoleChange = async (id, newRole) => {
        if (window.confirm("Rendre ce compte " + newRole + " ?")) {
            try {
                await axios.put(`http://localhost:5000/api/users/${id}/role`, { role: newRole }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                fetchUsers();
            } catch (error) {
                console.error("Erreur lors de la modification du rôle", error);
            }
        }
    };

    const generateRandomPassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const handleResetPassword = async (id) => {
        const newPassword = generateRandomPassword();
        if (window.confirm("Réinitialiser le mot de passe de ce compte ?")) {
            try {
                await axios.put(`http://localhost:5000/api/users/${id}/password`, { newPassword }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                await navigator.clipboard.writeText(newPassword);
                alert("Nouveau mot de passe copié dans le presse-papier.");
            } catch (error) {
                console.error("Erreur lors de la réinitialisation du mot de passe", error);
            }
        }
    };

    return (
        <div className="managing-panel">
            <div className="container pt-5 pb-5">
                <h2>Gestion des Utilisateurs</h2>
                <table className="table table-striped mt-4">
                    <thead>
                    <tr>
                        <th>Nom d'utilisateur</th>
                        <th>E-mail</th>
                        <th>Rôle</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button
                                    onClick={() => handleRoleChange(user._id, user.role === "admin" ? "user" : "admin")}
                                    className="btn btn-sm btn-warning me-2"
                                >
                                    <i className="bi bi-shield-lock"></i> {user.role === "admin" ? "Rétrograder" : "Promouvoir"}
                                </button>
                                <button
                                    onClick={() => handleResetPassword(user._id)}
                                    className="btn btn-sm btn-info me-2"
                                >
                                    <i className="bi bi-key"></i>
                                </button>
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="btn btn-sm btn-danger"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserManager;
