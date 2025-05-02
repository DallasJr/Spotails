import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" />;

    try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === "admin") {
            return children;
        } else {
            return <Navigate to="/" />;
        }
    } catch (err) {
        console.error("Token invalide");
        return <Navigate to="/login" />;
    }
};

export default AdminRoute;
