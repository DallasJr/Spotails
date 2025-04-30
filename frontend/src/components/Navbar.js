import React from "react";
import {Link, useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const isAuthenticated = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/");
        window.location.reload();
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-custom d-flex justify-content-between align-items-center">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img
                        src="/icon_1_-removebg-preview.png"
                        alt="logo"
                        width="40"
                        height="40"
                        className="d-inline-block align-text-top me-2"
                    />
                </Link>

                <div className="d-flex align-items-center">
                    <Link to="/cocktails" className="navbar-link me-2">
                        Nos Cocktails
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/favorites" className="navbar-link me-2">
                                Vos Favoris
                            </Link>
                            <button className="btn btn-outline-light me-2">
                                {username}
                            </button>
                            <button onClick={handleLogout} className="btn btn-danger">
                                Déconnexion
                            </button>
                        </>
                        ) : (
                        <>
                            <Link to="/login" className="btn btn-text-white me-2">
                                Connexion
                            </Link>
                            <Link to="/register" className="btn btn-custom">
                                Inscription
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
export default Navbar;