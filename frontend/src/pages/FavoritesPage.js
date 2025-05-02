import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Connecte-toi pour voir tes favoris");
                return;
            }

            try {
                const res = await axios.get("http://localhost:5000/api/favorites", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFavorites(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchFavorites();
    }, []);

    if (favorites.length === 0) return (
        <div className="container mt-5">
            <h2 className="text-center">Aucun favori pour l'instant ❤️</h2>
        </div>
    );

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Vos Cocktails Favoris 🍸</h1>
            <div className="row">
                {favorites.map((c) => (
                    <div key={c._id} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={`http://localhost:5000/uploads/${c.image}`}
                                className="card-img-top"
                                alt={c.name}
                                style={{height: "250px", objectFit: "contain"}}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{c.name}</h5>
                                <p className="card-text text-muted">{c.theme}</p>
                                <Link
                                    to={`/cocktails/${c._id}`}
                                    className="btn btn-primary mt-auto"
                                >
                                    Voir la recette
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesPage;
