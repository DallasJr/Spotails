import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminUserManager = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer ce compte ?")) {
            await axios.delete(`http://localhost:5000/api/users/${id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            fetchUsers();
        }
    };

    const handleRoleChange = async (id, newRole) => {
        if (window.confirm("Rendre ce compte " + newRole + " ?")) {
            await axios.put(`http://localhost:5000/api/users/${id}`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            fetchUsers();
        }
    };

    return (
        <div className="container mt-5">
            <h2>Gestion des Utilisateurs</h2>
            <table className="table table-striped mt-4">
                <thead>
                <tr>
                    <th>Nom d'utilisateur</th>
                    <th>Email</th>
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
    );
};

export default AdminUserManager;
