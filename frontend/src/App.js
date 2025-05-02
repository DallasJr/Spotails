import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CocktailList from "./pages/CocktailList";
import CocktailDetail from "./pages/CocktailDetail";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FavoritesPage from "./pages/FavoritesPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
      <Router>
          <div className="d-flex flex-column min-vh-100"> {}
              <Navbar />
              <div className="flex-grow-1"> {}
                  <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/cocktails" element={<CocktailList />} />
                      <Route path="/cocktails/:id" element={<CocktailDetail />} />
                      <Route path="/login" element={<LoginForm />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="*" element={<NotFoundPage />} />
                  </Routes>
              </div>
              <Footer /> {}
          </div>
      </Router>
  );
}

export default App;
