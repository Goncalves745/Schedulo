// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger"); // ficheiro que criaste

const authRoutes = require("./routes/auth");
const businessRoutes = require("./routes/business");
const servicesRoutes = require("./routes/services");
const appointmentsRoutes = require("./routes/appointments");
const publicRoutes = require("./routes/public");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/business/services", servicesRoutes);
app.use("/api/business/appointments", appointmentsRoutes);
app.use("/api/public", publicRoutes);

module.exports = app;
