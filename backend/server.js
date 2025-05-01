const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

connectDB().then(() =>{} );

app.use(cors());
app.use(express.json());

app.use("/api/cocktails", require("./routes/cocktails"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/favorites", require("./routes/favorites"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
