const express = require("express");
const cors = require("cors");
const docupilotRoutes = require("./routes/docupilot");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["https://consul.up.railway.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Docupilot Proxy", version: "1.0.0" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.use("/api/docupilot", docupilotRoutes);

app.listen(PORT, () => {
  console.log("Docupilot proxy running on port " + PORT);
});
