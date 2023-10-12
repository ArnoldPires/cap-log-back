const express = require("express");
const router = express.Router();
const Log = require("../models/modellog.js");

// Index - Get all logs
router.get("/", async (req, res) => {
  try {
    const logs = await Log.find();
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Create - Create a new log
router.post("/", async (req, res) => {
  try {
    const { title, entry } = req.body;
    const shipIsBroken = req.body.shipIsBroken === "on";
    const newLog = new Log({
      title,
      entry,
      shipIsBroken,
    });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Show - Get a single log by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findById(id);
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update - Update a log by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, entry } = req.body;
    const shipIsBroken = req.body.shipIsBroken === "on";

    const logToUpdate = await Log.findById(id);
    if (!logToUpdate) {
      return res.status(404).json({ error: 'Log not found' });
    }

    logToUpdate.title = title;
    logToUpdate.entry = entry;
    logToUpdate.shipIsBroken = shipIsBroken;

    await logToUpdate.save();
    res.json(logToUpdate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete - Delete a log by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const logToDelete = await Log.findById(id);
    if (!logToDelete) {
      return res.status(404).json({ error: 'Log not found' });
    }
    await logToDelete.remove();
    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;