const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Task = require("../models/Task");

// ✅ CREATE TASK (Admin only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can assign tasks" });
    }

    const task = await Task.create({
  title: req.body.title,
  assignedTo: req.body.assignedTo,
  projectId: req.body.projectId,   // 👈 ADD
  status: "pending"
});
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET TASKS (All users)
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE TASK (Only assigned user)
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    task.status = req.body.status;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;