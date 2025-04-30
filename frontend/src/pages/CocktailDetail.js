import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CocktailDetail = () => {
    const { id } = useParams();
    const [cocktail, setCocktail] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/cocktails/${id}`).then((res) => {
            setCocktail(res.data);
        });
    }, [id]);

    if (!cocktail) return <div>Loading...</div>;

    return (
        <div>
            <h1>{cocktail.name}</h1>
            <img src={cocktail.image} width={200} alt={cocktail.name} />
            <p><strong>Thème :</strong> {cocktail.theme}</p>
            <p><strong>Ingrédients :</strong> {cocktail.ingredients.join(", ")}</p>
            <p><strong>Recette :</strong> {cocktail.recipe}</p>
            <p><strong>Description :</strong> {cocktail.description}</p>
        </div>
    );
};

export default CocktailDetail;
