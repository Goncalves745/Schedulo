const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const authRoutes = require("./routes/auth");
const businessRoutes = require("./routes/business");
const servicesRoutes = require("./routes/services");
const appointmentsRoutes = require("./routes/appointments");
const publicRoutes = require("./routes/public");

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://schedulo-omega.vercel.app",
  "http://localhost:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/business/services", servicesRoutes);
app.use("/api/business/appointments", appointmentsRoutes);
app.use("/api/public", publicRoutes);

module.exports = app;
