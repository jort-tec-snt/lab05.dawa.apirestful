const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = 3000;
const HOST = "127.0.0.1";

const ticketRoutes = require("./routes/ticket.routes");
const notificationRoutes = require("./routes/notification.routes");

const errorHandler = require("./middlewares/errorHandler");

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Ruta inicial de prueba
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API RESTful!");
});

app.use("/tickets", ticketRoutes);
app.use("/notifications", notificationRoutes);
app.use(errorHandler);

const server = app.listen(PORT, HOST, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error(`No se pudo iniciar el servidor en ${HOST}:${PORT}: ${error.message}`);
  process.exitCode = 1;
});
