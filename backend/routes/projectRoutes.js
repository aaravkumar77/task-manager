const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Project = require("../models/Project");

// ✅ CREATE PROJECT (Admin only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create project" });
    }

    const project = await Project.create({
      name: req.body.name,
      createdBy: req.user.id
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET PROJECTS (All users)
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE PROJECT (Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete project" });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;