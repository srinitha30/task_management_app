require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();


// ==========================
// MIDDLEWARE
// ==========================

app.use(cors());
app.use(express.json());


// ==========================
// ROUTES
// ==========================

app.get("/", (req, res) => {
  res.send("TaskFlow API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


// ==========================
// MONGODB
// ==========================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((error) => {
    console.log("❌ MongoDB Connection Failed");
    console.log(error);
  });


// ==========================
// SERVER
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});