const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = 3000;

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Ruta inicial de prueba
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API RESTful!");
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});