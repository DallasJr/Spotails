import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AccountPage.css";

const AccountPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [activeTab, setActiveTab] = useState("account");
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const fetchUserData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/users/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setUserInfo(response.data);
            setNewUsername(response.data.username);
            setNewEmail(response.data.email);
        } catch (err) {
            setError("Impossible de récupérer les informations de l'utilisateur.");
        }
    };

    useEffect(() => {

        fetchUserData();
    }, []);

    const handleChangeUsername = async () => {
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(newUsername) || newUsername.length > 16 || newUsername.length < 3) {
            setError("Le nom d'utilisateur doit être alphanumérique et contenir entre 3 et 16 caractères.");
            setSuccessMessage("");
            return;
        }
        try {
            await axios.put(
                "http://localhost:5000/api/users/update-username",
                {username: newUsername},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            localStorage.setItem("username", newUsername);
            setSuccessMessage("Nom d'utilisateur mis à jour avec succès !");
            setError("");
        } catch (err) {
            setError("Erreur lors de la mise à jour du pseudo. " + err.response?.data?.message || err.message);
            setSuccessMessage("");
            fetchUserData();
        }
    };

    const handleChangeEmail = async () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(newEmail)) {
            setError("L'adresse email n'est pas valide.");
            setSuccessMessage("");
            return;
        }
        try {
            await axios.put(
                "http://localhost:5000/api/users/update-email",
                { email: newEmail },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setSuccessMessage("E-mail mis à jour avec succès !");
            setError("");
        } catch (err) {
            setError("Erreur lors de la mise à jour de l'email. " + (err.response?.data?.message || err.message));
            fetchUserData();
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
        );
        if (confirmDelete) {
            try {
                await axios.delete("http://localhost:5000/api/users/delete-account", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    data: {
                        password: prompt("Entrez votre mot de passe pour confirmer la suppression."),
                    },
                });
                alert("Compte supprimé avec succès.");
                localStorage.removeItem("token");
                navigate("/login");
            } catch (err) {
                alert("Erreur lors de la suppression du compte. " + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleChangePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = password;

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Tous les champs sont requis.");
            setSuccessMessage("");
            return;
        }

        if (newPassword.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            setSuccessMessage("");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Les nouveaux mots de passe ne correspondent pas.");
            setSuccessMessage("");
            return;
        }

        try {
            await axios.put(
                "http://localhost:5000/api/users/update-password",
                { currentPassword, newPassword, confirmPassword },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setSuccessMessage("Mot de passe mis à jour avec succès.");
            setError("");
        } catch (err) {
            setError("Erreur lors de la mise à jour du mot de passe. " + (err.response?.data?.message || err.message));
            setSuccessMessage("");
        }
    };

    if (!userInfo) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="container pt-5 pb-5 account-page">
            <div
                className="mb-4 p-4 rounded-4"
                style={{
                    background: "linear-gradient(90deg, #a4508b 0%, #5f0a87 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 32px rgba(90,10,135,0.08)",
                    borderRadius: "1.5rem"
                }}
            >
                <h2 className="fw-bold mb-2" style={{ fontSize: "1.6rem" }}>
                    Bienvenue, {userInfo?.username}
                </h2>
                <p className="mb-3" style={{ color: "#f3e6fa" }}>
                    Gérez votre compte Spotails et vos préférences.
                </p>
            </div>

            {/* Section compte/navigation */}
            <div className="mb-4 p-4 rounded-4"
                 style={{
                     background: "#232323",
                     color: "#fff",
                     boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
                     borderRadius: "1.5rem"
                 }}>
                <div className="fw-bold mb-3" style={{ fontSize: "1.1rem" }}>Compte</div>
                <div className="list-group list-group-flush">
                    <div className="list-group-item d-flex align-items-center justify-content-between bg-transparent px-0 py-3"
                         style={{ cursor: "pointer" }}
                         onClick={() => setActiveTab("profile")}>
                        <span style={{ color: "#fff" }}><i className="bi bi-pencil me-2"></i>Modifier le profil</span>
                        <i className="bi bi-chevron-right"></i>
                    </div>
                    <div className="list-group-item d-flex align-items-center justify-content-between bg-transparent border-0 px-0 py-3"
                         style={{ cursor: "pointer" }}
                         onClick={() => setActiveTab("security")}>
                        <span style={{ color: "#fff" }}><i className="bi bi-shield-lock me-2"></i>Sécurité</span>                        <i className="bi bi-chevron-right"></i>
                    </div>
                    <div className="list-group-item d-flex align-items-center justify-content-between bg-transparent border-0 px-0 py-3"
                         style={{ cursor: "pointer" }}
                         onClick={() => setActiveTab("delete")}>
                        <span className="text-danger"><i className="bi bi-trash me-2"></i>Supprimer le compte</span>
                        <i className="bi bi-chevron-right"></i>
                    </div>
                </div>
            </div>

            {/* Modales ou sections contextuelles */}
            {activeTab === "profile" && (
                <div className="mb-4 p-4 rounded-4" style={{ background: "#181818", color: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.12)" }}>
                    <h5 className="fw-bold mb-3">Modifier le profil</h5>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    <div className="mb-3">
                        <label className="form-label">Pseudo</label>
                        <input
                            type="text"
                            className="form-control"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                        <button className="btn btn-success mt-2" onClick={handleChangeUsername}>
                            Sauvegarder
                        </button>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <button className="btn btn-success mt-2" onClick={handleChangeEmail}>
                            Sauvegarder
                        </button>
                    </div>
                    <button className="btn btn-secondary mt-2" onClick={() => { setActiveTab(""); setError(""); setSuccessMessage(""); }}>
                        Retour
                    </button>
                </div>
            )}

            {activeTab === "security" && (
                <div className="mb-4 p-4 rounded-4" style={{ background: "#181818", color: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.12)" }}>
                    <h5 className="fw-bold mb-3">Sécurité</h5>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    <div className="mb-3">
                        <label className="form-label">Mot de passe actuel</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password.currentPassword || ""}
                            placeholder="****************"
                            onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nouveau mot de passe</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password.newPassword || ""}
                            placeholder="****************"
                            onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password.confirmPassword || ""}
                            placeholder="****************"
                            onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                        />
                    </div>
                    <button className="btn btn-success" onClick={handleChangePassword}>
                        Sauvegarder
                    </button>
                    <button className="btn btn-secondary ms-2" onClick={() => { setActiveTab(""); setError(""); setSuccessMessage(""); }}>
                        Retour
                    </button>
                </div>
            )}

            {activeTab === "delete" && (
                <div className="mb-4 p-4 rounded-4" style={{ background: "#181818", color: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.12)" }}>
                    <h5 className="fw-bold mb-3 text-danger">Supprimer le compte</h5>
                    <p>Cette action est <strong>irréversible</strong>. Toutes vos données seront supprimées.</p>
                    <button className="btn btn-danger" onClick={handleDeleteAccount}>
                        Confirmer la suppression
                    </button>
                    <button className="btn btn-secondary ms-2" onClick={() => setActiveTab("")}>
                        Annuler
                    </button>
                </div>
            )}
        </div>
    );
};

export default AccountPage;
