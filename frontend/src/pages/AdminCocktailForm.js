import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AdminCocktailForm = () => {
    const [form, setForm] = useState({
        name: "",
        theme: "",
        ingredients: "",
        recipe: "",
        description: "",
        image: ""
    });

    const [imageFile, setImageFile] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/api/cocktails/${id}`)
                .then(res => {
                    const c = res.data;
                    setForm({
                        name: c.name,
                        theme: c.theme,
                        ingredients: c.ingredients.join(", "),
                        recipe: c.recipe,
                        description: c.description,
                        image: c.image
                    });
                });
        }
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = new FormData();
        dataToSend.append("name", form.name);
        dataToSend.append("theme", form.theme);
        dataToSend.append("ingredients", form.ingredients);
        dataToSend.append("recipe", form.recipe);
        dataToSend.append("description", form.description);

        if (imageFile) dataToSend.append("image", imageFile);

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data"
            }
        };

        if (id) {
            if (window.confirm("Modifier ce cocktail ?")) {
                await axios.put(`http://localhost:5000/api/cocktails/${id}`, dataToSend, config);
                alert("Cocktail modifié !");
            }
        } else {
            if (window.confirm("Ajouter ce cocktail ?")) {
                await axios.post("http://localhost:5000/api/cocktails", dataToSend, config);
                alert("Cocktail ajouté !");
            }
        }
        navigate("/admin/cocktails");
    };

    return (
        <div className="container mt-5">
            <h2>{id ? "Modifier" : "Ajouter"} un Cocktail</h2>
            <form onSubmit={handleSubmit}>
                {["name", "theme", "ingredients", "recipe", "description"].map((field) => (
                    <div key={field} className="mb-3">
                        <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                            type="text"
                            className="form-control"
                            name={field}
                            value={form[field]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                {id && form.image && (
                    <div className="mb-3">
                        <label className="form-label">Image actuelle</label>
                        <div>
                            <img
                                src={`http://localhost:5000/uploads/${form.image}`}
                                alt="Cocktail"
                                style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                        </div>
                    </div>
                )}
                <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        name="image"
                        onChange={handleFileChange}
                        {...(!id && { required: true })}
                    />
                </div>
                <button type="submit" className="btn btn-success">{id ? "Modifier" : "Ajouter"}</button>
            </form>
        </div>
    );
};

export default AdminCocktailForm;
