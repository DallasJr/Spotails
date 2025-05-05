import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { processError } from '../utils/errorUtils';

const AdminCocktailForm = () => {
    const [form, setForm] = useState({
        name: "",
        theme: "",
        ingredients: "",
        recipe: "",
        description: "",
        image: "",
        color: "#13a444"
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
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
                        image: c.image,
                        color: c.color || "#13a444"
                    });
                    setPreviewUrl(`http://localhost:5000/uploads/${c.image}`);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key !== "image") dataToSend.append(key, value);
        });

        if (imageFile) dataToSend.append("image", imageFile);

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data"
            }
        };

        try {
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
        } catch (error) {
            processError(error);
        }
    };

    const ingredientsList = form.ingredients
        ? form.ingredients.split(",").map((item, idx) => <li key={idx}>{item.trim()}</li>)
        : null;

    return (
        <div className="cocktail-form">
            <div className="container pt-5 pb-5">
                <div className="row g-0">
                    <div className="col-md-5">
                        <div className="card preview-card">
                            <div className="card-body text-center">
                                <h3 className="card-title mb-3">{form.name || "Nom du cocktail"}</h3>
                                <div
                                    style={{
                                        backgroundColor: form.color,
                                        borderRadius: "70px",
                                        padding: "20px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "220px",
                                        width: "220px",
                                        margin: "0 auto 20px"
                                    }}
                                >
                                    <img
                                        src={previewUrl || "http://localhost:5000/uploads/cocktail-placeholder.png"}
                                        alt="Cocktail"
                                        className="img-fluid rounded"
                                        style={{ maxHeight: "160px", objectFit: "contain" }}
                                    />
                                </div>

                                <h5 className="text-muted">{form.theme || "Thème du cocktail"}</h5>
                                <strong>Description :</strong>
                                <p className="mt-2">{form.description || "Pas de description"}</p>
                                <strong>Recette :</strong>
                                <p className="text-start mt-2">{form.recipe || "Pas de recette"}</p>
                                <strong>Ingrédients :</strong>
                                {ingredientsList ? (
                                    <ul className="text-start mt-2">{ingredientsList}</ul>
                                ) : (
                                    <p>Aucun ingrédient</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-7">
                        <div className="card p-4 filling-card">
                            <h4 className="mb-4">{id ? "Modifier" : "Ajouter"} un Cocktail</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nom</label>
                                    <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Thème</label>
                                    <input type="text" className="form-control" name="theme" value={form.theme} onChange={handleChange} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Ingrédients (séparés par des virgules)</label>
                                    <textarea className="form-control" name="ingredients" value={form.ingredients} onChange={handleChange} rows="2" required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Recette</label>
                                    <textarea className="form-control" name="recipe" value={form.recipe} onChange={handleChange} rows="3" required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows="2" required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Couleur associée</label>
                                    <input type="color" className="form-control form-control-color" name="color" value={form.color} onChange={handleChange} />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Image</label>
                                    <input type="file" className="form-control" accept="image/*" name="image" onChange={handleFileChange} {...(!id && { required: true })} />
                                </div>

                                <button type="submit" className="btn btn-success d-block mx-auto px-5">
                                    {id ? "Modifier" : "Ajouter"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCocktailForm;
