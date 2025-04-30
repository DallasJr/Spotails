import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";

const Navbar = () => {
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
                    <Link to="/login" className="btn btn-text-white me-2">
                        Connexion
                    </Link>
                    <Link to="/register" className="btn btn-custom">
                        Inscription
                    </Link>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;