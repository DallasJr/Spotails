import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CocktailList from "./pages/CocktailList";
import CocktailDetail from "./pages/CocktailDetail";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";

function App() {
  return (
      <Router>
          <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/cocktails" element={<CocktailList />} />
                <Route path="/cocktails/:id" element={<CocktailDetail />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
      </Router>
  );
}

export default App;
