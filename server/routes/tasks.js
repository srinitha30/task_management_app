const express = require("express");

const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");

const router = express.Router();


// ==========================
// CREATE TASK
// ==========================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      startDate,
      dueDate,
      completionDate,
      status,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      priority: priority || "Medium",
      startDate: startDate || null,
      dueDate: dueDate || null,
      completionDate: completionDate || null,
      status: status || "Pending",
      userId: req.user.userId,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });

  } catch (error) {
    console.error("CREATE TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});


// ==========================
// GET MY TASKS
// ==========================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      tasks,
    });

  } catch (error) {
    console.error("GET TASKS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});


// ==========================
// UPDATE TASK
// ==========================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const {
      title,
      description,
      priority,
      startDate,
      dueDate,
      completionDate,
      status,
    } = req.body;

    if (title !== undefined) {
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (startDate !== undefined) {
      task.startDate = startDate || null;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }

    if (completionDate !== undefined) {
      task.completionDate =
        completionDate || null;
    }

    if (status !== undefined) {
      task.status = status;
    }

    await task.save();

    res.json({
      message: "Task updated successfully",
      task,
    });

  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
});


// ==========================
// DELETE TASK
// ==========================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });

  } catch (error) {
    console.error("DELETE TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
});


module.exports = router;