import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import NotFoundPage from "./NotFoundPage";

const CocktailDetail = () => {
    const { id } = useParams();
    const [cocktail, setCocktail] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchCocktail = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/cocktails/${id}`);
                setCocktail(res.data);
            } catch (err) {
                setNotFound(true);
            }
        };

        const checkIfFavorite = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/favorites/check/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsFavorite(res.data.isFavorite);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCocktail();
        const token = localStorage.getItem("token");
        if (token) {
            checkIfFavorite();
        }
    }, [id]);

    const handleFavoriteToggle = async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Connecte-toi pour ajouter aux favoris");
        try {
            if (isFavorite) {
                await axios.delete(
                    `http://localhost:5000/api/favorites/remove/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsFavorite(false);
            } else {
                await axios.post(
                    `http://localhost:5000/api/favorites/add/${id}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsFavorite(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (notFound) return <NotFoundPage />;
    if (!cocktail) return <div>Chargement...</div>;

    return (
        <div className="container mt-5">
            <h1>{cocktail.name}</h1>
            <img src={`http://localhost:5000/uploads/${cocktail.image}`} width={300} alt={cocktail.name} />
            <p><strong>Thème :</strong> {cocktail.theme}</p>
            <p><strong>Ingrédients :</strong> {cocktail.ingredients.join(", ")}</p>
            <p><strong>Recette :</strong> {cocktail.recipe}</p>
            <p><strong>Description :</strong> {cocktail.description}</p>
            <button className="btn btn-outline-warning mt-3" onClick={handleFavoriteToggle}>
                <i className={`bi ${isFavorite ? "bi-star-fill" : "bi-star"}`}></i>
                {" "} {isFavorite ? "Favori" : "Ajouter aux favoris"}
            </button>
        </div>
    );
};

export default CocktailDetail;
