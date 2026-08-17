const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/task");

const router = express.Router();

// ==========================================
// TEST ROUTE
// ==========================================
router.get("/test", (req, res) => {
  console.log("🔥 TASK ROUTE REACHED");

  res.json({
    message: "Task route is working!",
  });
});

// ==========================================
// CREATE A TASK
// POST /api/tasks
// ==========================================
router.post("/", async (req, res) => {
  try {
    console.log("📥 Creating task:", req.body);

    const task = new Task(req.body);
    const savedTask = await task.save();

    console.log("✅ Task created:", savedTask);

    res.status(201).json(savedTask);
  } catch (error) {
    console.error("❌ Create task error:", error.message);

    res.status(400).json({
      message: error.message,
    });
  }
});

// ==========================================
// GET ALL TASKS
// GET /api/tasks
// ==========================================
router.get("/", async (req, res) => {
  try {
    console.log("📋 Getting all tasks...");
    console.log(
      "Mongoose readyState:",
      mongoose.connection.readyState
    );
    console.log(
      "Task DB readyState:",
      Task.db.readyState
    );

    const tasks = await Task.find().sort({
      createdAt: -1,
    });

    console.log(`✅ Found ${tasks.length} tasks`);

    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Get tasks error:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// GET ONE TASK
// GET /api/tasks/:id
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    // Check whether ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("❌ Get task error:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// UPDATE A TASK
// PUT /api/tasks/:id
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    console.log("✅ Task updated:", task);

    res.status(200).json(task);
  } catch (error) {
    console.error("❌ Update task error:", error.message);

    res.status(400).json({
      message: error.message,
    });
  }
});

// ==========================================
// DELETE A TASK
// DELETE /api/tasks/:id
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    console.log("🗑️ Task deleted:", task._id);

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete task error:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports = router;