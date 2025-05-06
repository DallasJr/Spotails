import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CocktailList = () => {
    const [cocktails, setCocktails] = useState([]);
    const [selectedCocktail, setSelectedCocktail] = useState(null);

    useEffect(() => {
        fetchCocktails();
    }, []);

    const fetchCocktails = async () => {
        const res = await axios.get("http://localhost:5000/api/cocktails");
        setCocktails(res.data);
        setSelectedCocktail(res.data[0]);
    };

    const handleSelect = (cocktail) => {
        setSelectedCocktail(cocktail);
    };

    return (
        <div className="container-fluid py-4 cocktail-list">
            <div className="row g-0 d-flex align-items-stretch">
                <div className="col-md-6 d-flex flex-column justify-content-center p-5">
                    {selectedCocktail && (
                        <>
                            <h2 className="cocktail-theme mb-4" style={{ color: selectedCocktail.color }}>
                                {selectedCocktail.theme}
                            </h2>
                            <h1 className="cocktail-description mb-4">{selectedCocktail.description}</h1>
                            <div className="mt-4">
                                <Link to={`/cocktails/${selectedCocktail._id}`} className="btn btn-light me-3" style={{ backgroundColor: selectedCocktail.color, borderColor: selectedCocktail.color }}>En savoir plus</Link>
                                <button className="btn btn-outline-warning">Favori</button>
                            </div>
                        </>
                    )}
                </div>

                <div className="col-md-6 position-relative p-0">
                    {selectedCocktail && (
                        <div className="cocktail-display d-flex align-items-center justify-content-center"
                             style={{ backgroundColor: selectedCocktail.color }}>
                            <img src={`http://localhost:5000/uploads/${selectedCocktail.image}`} alt={selectedCocktail.name} className="cocktail-main-img" />
                            <div className="cocktail-name">{selectedCocktail.name.toUpperCase()}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="row mt-3">
                <div className="col d-flex align-items-center">
                    <div className="d-flex overflow-auto">
                        {cocktails.map((cocktail) => (
                            <img
                                key={cocktail._id}
                                src={`http://localhost:5000/uploads/${cocktail.image}`}
                                alt={cocktail.name}
                                className="cocktail-thumb me-2"
                                onClick={() => handleSelect(cocktail)}
                                style={{ backgroundColor: cocktail.color,
                                    border: selectedCocktail && selectedCocktail._id === cocktail._id
                                        ? "4px solid white"
                                        : "", }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CocktailList;
