import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CocktailList = () => {
    const [cocktails, setCocktails] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/cocktails").then((res) => {
            setCocktails(res.data);
        });
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Nos Cocktails 🍹</h1>

            <div className="row">
                {cocktails.map((c) => (
                    <div key={c._id} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={c.image}
                                className="card-img-top"
                                alt={c.name}
                                style={{height: "250px", objectFit: "cover"}}
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

export default CocktailList;
