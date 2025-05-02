import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminCocktailManager = () => {
    const [cocktails, setCocktails] = useState([]);

    const fetchCocktails = async () => {
        const res = await axios.get("http://localhost:5000/api/cocktails");
        setCocktails(res.data);
    };

    useEffect(() => {
        fetchCocktails();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer ce cocktail ?")) {
            await axios.delete(`http://localhost:5000/api/cocktails/${id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            fetchCocktails();
        }
    };

    return (
        <div className="container mt-5">
            <h2>Gestion des Cocktails</h2>
            <a href="/admin/cocktails/add" className="btn btn-primary mb-3">
                <i className="bi bi-plus-circle"></i> Ajouter un cocktail
            </a>
            <table className="table table-striped mt-4">
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Thème</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {cocktails.map(cocktail => (
                    <tr key={cocktail._id}>
                        <td>{cocktail.name}</td>
                        <td>{cocktail.theme}</td>
                        <td>
                            <a href={`/cocktails/${cocktail._id}`} className="btn btn-sm btn-info me-2">
                                <i className="bi bi-eye"></i>
                            </a>
                            <a href={`/admin/cocktails/edit/${cocktail._id}`} className="btn btn-sm btn-warning me-2">
                                <i className="bi bi-pencil"></i>
                            </a>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(cocktail._id)}
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

export default AdminCocktailManager;
