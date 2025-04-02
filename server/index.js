const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const businessRoutes = require("./routes/business");
const servicesRoutes = require("./routes/services");
const appointmentsRoutes = require("./routes/appointments");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/business/services", servicesRoutes);
app.use("/api/appointments", appointmentsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
