import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CocktailList = () => {
    const [cocktails, setCocktails] = useState([]);
    const [selectedCocktail, setSelectedCocktail] = useState(null);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [displayAnimation, setDisplayAnimation] = useState("animate-in");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    // États pour la recherche et filtrage
    const [searchTerm, setSearchTerm] = useState(""); // Pour l'input
    const [search, setSearch] = useState(""); // Pour le filtrage effectif
    const [selectedTheme, setSelectedTheme] = useState(""); // Thème sélectionné
    const [isSearchFocused, setIsSearchFocused] = useState(false); // État pour la mise en évidence du champ de recherche

    // Extraction des thèmes uniques des cocktails
    const uniqueThemes = useMemo(() => {
        const themes = cocktails.map(cocktail => cocktail.theme);
        return ["Tous les thèmes", ...new Set(themes)];
    }, [cocktails]);

    useEffect(() => {

        fetchCocktails();
        const token = localStorage.getItem("token");
        if (token) fetchFavorites();
    }, []);

    const fetchCocktails = async () => {
        const res = await axios.get("http://localhost:5000/api/cocktails");
        setCocktails(res.data);
        setSelectedCocktail(res.data[0]);
    };

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/favorites", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavoriteIds(res.data.map(fav => fav._id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleFavoriteToggle = async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Connecte-toi pour ajouter aux favoris");

        try {
            if (favoriteIds.includes(selectedCocktail._id)) {
                await axios.delete(
                    `http://localhost:5000/api/favorites/remove/${selectedCocktail._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFavoriteIds(favoriteIds.filter(id => id !== selectedCocktail._id));
            } else {
                await axios.post(
                    `http://localhost:5000/api/favorites/add/${selectedCocktail._id}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFavoriteIds([...favoriteIds, selectedCocktail._id]);
            }
        } catch (err) {
            console.error(err);
        }
    };


    const handleSelect = (cocktail) => {
        if (selectedCocktail && cocktail._id === selectedCocktail._id) return;

        setDisplayAnimation("animate-out");
        setTimeout(() => {
            setSelectedCocktail(cocktail);
            setDisplayAnimation("animate-in");
        }, 900);
    };

    // Fonction pour appliquer la recherche
    const handleSearch = () => {
        setSearch(searchTerm);
    };

    // Filtrage par nom, ingrédient et thème
    const filteredCocktails = useMemo(() => {
        return cocktails.filter(cocktail => {
            // Filtre favoris
            if (showFavoritesOnly && !favoriteIds.includes(cocktail._id)) {
                return false;
            }

            // Filtre par thème
            if (selectedTheme && selectedTheme !== "Tous les thèmes" && cocktail.theme !== selectedTheme) {
                return false;
            }

            // Si pas de recherche, retourner tous les cocktails qui respectent les filtres ci-dessus
            if (!search.trim()) {
                return true;
            }

            // Recherche par nom
            const matchName = cocktail.name.toLowerCase().includes(search.toLowerCase());

            // Recherche par ingrédient
            const matchIngredient = Array.isArray(cocktail.ingredients) &&
                cocktail.ingredients.some(i => {
                    if (typeof i === "object" && i.name) {
                        return i.name.toLowerCase().includes(search.toLowerCase());
                    }
                    if (typeof i === "string") {
                        return i.toLowerCase().includes(search.toLowerCase());
                    }
                    return false;
                });

            return matchName || matchIngredient;
        });
    }, [cocktails, search, showFavoritesOnly, favoriteIds, selectedTheme]);

    // Sélection automatique du premier cocktail filtré
    useEffect(() => {
        if (filteredCocktails.length > 0) {
            setSelectedCocktail(filteredCocktails[0]);
        } else {
            setSelectedCocktail(null);
        }
    }, [filteredCocktails]);

    return (
        <div className="container-fluid py-4 cocktail-list">
            <div
                className="text-center mb-1 mb-md-5 p-4 rounded-4"
                style={{
                    background: "linear-gradient(120deg, rgba(18, 102, 51, 0.9) 0%, rgba(29, 185, 84, 0.9) 50%, rgba(30, 215, 96, 0.9) 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 32px rgba(29,185,84,0.25)",
                    maxWidth: "900px",
                    margin: "0 auto 2rem",
                }}
            >
                <h1 className="display-4 fw-bold mb-2" style={{ letterSpacing: "2px", textShadow: "0px 1px 3px rgba(0,0,0,0.2)" }}>
                    <i className="bi bi-music-note-beamed me-2"> </i>
                    Nos Cocktails
                </h1>
                <p className="lead" style={{ color: "rgba(255,255,255,0.9)" }}>
                    Explorez notre sélection de cocktails thématiques et musicaux.
                </p>
            </div>

            <div className="row mb-4">
                <div className="col-12">
                    <div className="search-container mb-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
                        <div
                            className="d-flex justify-content-center flex-wrap align-items-center"
                            style={{ gap: '15px' }}
                        >
                            {/* Sélecteur de thème stylisé */}
                            <div className="filter-item position-relative">
                                <i className="bi bi-vinyl position-absolute"
                                   style={{
                                       left: "15px",
                                       top: "50%",
                                       transform: "translateY(-50%)",
                                       color: "#1ED760",
                                       zIndex: 2
                                   }}
                                ></i>
                                <select
                                    value={selectedTheme}
                                    onChange={(e) => setSelectedTheme(e.target.value)}
                                    style={{
                                        borderRadius: "500px",
                                        background: "#242424",
                                        color: "white",
                                        border: "1px solid #3E3E3E",
                                        padding: "12px 15px 12px 40px",
                                        fontSize: "0.9rem",
                                        appearance: "none",
                                        backgroundImage: "url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%231ED760' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E\")",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "calc(100% - 15px) center",
                                        backgroundSize: "12px",
                                        width: "200px",
                                        transition: "border-color 0.2s"
                                    }}
                                >
                                    {uniqueThemes.map((theme, index) => (
                                        <option key={index} value={theme === "Tous les thèmes" ? "" : theme}>
                                            {theme}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Barre de recherche d'ingrédient stylisée */}
                            <div className="filter-item position-relative" style={{ width: '250px' }}>
                                <i className="bi bi-cup-straw position-absolute"
                                   style={{
                                       left: "15px",
                                       top: "50%",
                                       transform: "translateY(-50%)",
                                       color: "#1ED760",
                                       zIndex: 2
                                   }}
                                ></i>
                                <input
                                    type="text"
                                    placeholder="Cocktail, Ingrédient..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    style={{
                                        width: "100%",
                                        borderRadius: "500px",
                                        background: "#242424",
                                        color: "white",
                                        border: isSearchFocused ? "1px solid #1ED760" : "1px solid #3E3E3E",
                                        padding: "12px 15px 12px 40px",
                                        fontSize: "0.9rem",
                                        outline: "none",
                                        transition: "border-color 0.2s"
                                    }}
                                />
                                {searchTerm && (
                                    <div
                                        onClick={() => {
                                            setSearchTerm("");
                                            handleSearch();
                                        }}
                                        style={{
                                            position: "absolute",
                                            right: "15px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            backgroundColor: "#535353",
                                            borderRadius: "50%",
                                            width: "24px",
                                            height: "24px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            zIndex: 2,
                                            transition: "background-color 0.2s"
                                        }}
                                        onMouseEnter={e => e.target.style.backgroundColor = "#6E6E6E"}
                                        onMouseLeave={e => e.target.style.backgroundColor = "#535353"}
                                    >
                                        <i className="bi bi-x" style={{ color: "white", fontSize: "14px" }}></i>
                                    </div>
                                )}
                            </div>

                            {/* Bouton Rechercher amélioré */}
                            <button
                                onClick={handleSearch}
                                style={{
                                    backgroundColor: "#1ED760",
                                    border: "none",
                                    borderRadius: "500px",
                                    color: "black",
                                    fontWeight: "bold",
                                    padding: "12px 30px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseEnter={e => {
                                    e.target.style.backgroundColor = "#22FF70";
                                    e.target.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={e => {
                                    e.target.style.backgroundColor = "#1ED760";
                                    e.target.style.transform = "translateY(0)";
                                }}
                            >
                                <i className="bi bi-filter-circle-fill"></i>
                                Rechercher
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row g-0 d-flex align-items-stretch">
                <div className="col-md-6 d-flex flex-column justify-content-center py-3 py-md-5 pe-md-4">
                    {selectedCocktail && (
                        <div className={`cocktail-infos ${displayAnimation}`}
                            style={{
                                backgroundImage: `url(http://localhost:5000/uploads/${selectedCocktail.thumbnail})`,
                                backgroundSize: "cover"
                            }}>
                            <div className="theme-badge mb-4">
                                <span style={{
                                    background: selectedCocktail.color,
                                    color: selectedCocktail.textColor,
                                    padding: "5px 15px",
                                    borderRadius: "50px",
                                    fontSize: "1.1rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                                }}>
                                    <i className="bi bi-vinyl-fill me-2"></i>
                                    {selectedCocktail.theme}
                                </span>
                            </div>
                            <h1 className="cocktail-description mb-4" style={{textShadow: "2px 2px 3px black"}}>{selectedCocktail.description}</h1>
                            <div className="mt-4 d-flex flex-wrap justify-content-md-start justify-content-center">
                                <Link to={`/cocktails/${selectedCocktail._id}`} className="btn btn-light me-4 mb-sm-3 mb-3 shadow"
                                      style={{
                                          backgroundColor: selectedCocktail.color,
                                          borderColor: selectedCocktail.color,
                                          color: selectedCocktail.textColor
                                      }}>
                                    <i className="bi bi-arrow-right-circle me-2"></i>
                                    En savoir plus
                                </Link>
                                <button
                                    className={`btn ${favoriteIds.includes(selectedCocktail._id) ? 'btn-warning' : 'btn-outline-warning'} mb-sm-3 mb-3 shadow`}
                                    onClick={handleFavoriteToggle}
                                    style={{
                                        borderRadius: "2rem",
                                        fontWeight: "bold",
                                        letterSpacing: "1px",
                                        padding: "10px 20px",
                                        transition: "all 0.25s ease"
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = "translateY(-4px)"}
                                    onMouseLeave={(e) => e.target.style.transform = "translateY(0px)"}
                                >
                                    <i className={`bi ${favoriteIds.includes(selectedCocktail._id) ? "bi-star-fill" : "bi-star"}`}></i>
                                    {" "} {favoriteIds.includes(selectedCocktail._id) ? "Favori" : "Ajouter aux favoris"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-md-6 position-relative p-0">
                    {selectedCocktail && (
                        <div className={`cocktail-display d-flex align-items-center justify-content-center ${displayAnimation}`}
                             style={{backgroundColor: selectedCocktail.color}}>
                            <img src={`http://localhost:5000/uploads/${selectedCocktail.image}`}
                                 alt={selectedCocktail.name} className={`cocktail-main-img cocktail-display-image ${displayAnimation}`}/>
                            <div className="cocktail-name" style={{ color: selectedCocktail.textColor }}>{selectedCocktail.name.toUpperCase()}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="row mt-3">
                <div className="col d-flex align-items-center">
                    <div className="d-flex align-items-center ms-2 me-4 ms-lg-5 ms-md-5 ms-sm-2 me-md-3 me-lg-3 me-sm-4">
                       <span
                           onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                           style={{
                               cursor: "pointer",
                               fontSize: "2.2rem",
                               color: showFavoritesOnly ? "#FFD700" : "#aaa",
                               transition: "all 0.2s ease"
                           }}
                           className="text-warning star-filter"
                           onMouseEnter={(e) => e.target.style.transform = "scale(1.15) rotate(12deg)"}
                           onMouseLeave={(e) => e.target.style.transform = "scale(1) rotate(0deg)"}
                       >
                          <i className={`bi ${showFavoritesOnly ? "bi-star-fill" : "bi-star"}`}></i>
                        </span>
                        <span className="ms-2" style={{
                            fontSize: "0.9rem",
                            opacity: 0.7,
                            color: "white"
                        }}>
                           {showFavoritesOnly ? "Favoris uniquement" : "Tous les cocktails"}
                       </span>
                    </div>
                    <div className="d-flex overflow-auto cocktails-listing">
                        {cocktails
                            .filter(cocktail => !showFavoritesOnly || favoriteIds.includes(cocktail._id))
                            .map((cocktail) => (
                            <div
                                key={cocktail._id}
                                className="position-relative me-3"
                                onClick={() => handleSelect(cocktail)}
                                style={{cursor: "pointer"}}
                            >
                                <img
                                    src={`http://localhost:5000/uploads/${cocktail.image}`}
                                    alt={cocktail.name}
                                    className="cocktail-thumb"
                                    style={{
                                        backgroundImage: `url(http://localhost:5000/uploads/${cocktail.thumbnail})`,
                                        border:
                                            selectedCocktail && selectedCocktail._id === cocktail._id
                                                ? "4px solid white"
                                                : "",
                                        backgroundSize: "cover"
                                    }}
                                />
                                <div className="thumb-overlay" style={{
                                    position: "absolute",
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)",
                                    borderRadius: "1.2rem"
                                }}></div>
                                {favoriteIds.includes(cocktail._id) && (
                                    <span className="favorite-badge position-absolute" style={{
                                        top: "10px",
                                        right: "10px",
                                        background: "rgba(255,215,0,0.8)",
                                        color: "#000",
                                        borderRadius: "50%",
                                        width: "24px",
                                        height: "24px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                        zIndex: 2
                                    }}>
                                        <i className="bi bi-star-fill" style={{ fontSize: "14px" }}></i>
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CocktailList;
