const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// All task routes require authentication
router.use(auth);

// @route   GET /api/tasks
// @desc    Get all tasks for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a single task by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }

    res.json({ success: true, task });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post(
  '/',
  body('title', 'Title is required').notEmpty().trim(),
  body('category').optional().isIn(['Work', 'Personal', 'Study', 'Health', 'Other']),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']),
  body('status').optional().isIn(['To Do', 'In Progress', 'Completed']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const { title, description, category, priority, status, dueDate } = req.body;

      // Determine max order
      const highestTask = await Task.findOne({ user: req.user.id }).sort({ order: -1 });
      const newOrder = highestTask ? highestTask.order + 1 : 0;

      const task = await Task.create({
        user: req.user.id,
        title,
        description: description || '',
        category: category || 'Other',
        priority: priority || 'Medium',
        status: status || 'To Do',
        dueDate: dueDate || null,
        order: newOrder
      });

      res.status(201).json({
        success: true,
        task
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @route   PUT /api/tasks/reorder
// @desc    Reorder tasks
// @access  Private
router.put('/reorder', async (req, res) => {
  try {
    const { tasks } = req.body;
    
    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ success: false, message: 'Invalid tasks array' });
    }

    // Bulk write order updates
    const bulkOps = tasks.map(t => ({
      updateOne: {
        filter: { _id: t.id, user: req.user.id },
        update: { $set: { order: t.order } }
      }
    }));

    if (bulkOps.length > 0) {
      await Task.bulkWrite(bulkOps);
    }

    res.json({ success: true, message: 'Tasks reordered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put(
  '/:id',
  body('title').optional().notEmpty().trim(),
  body('category').optional().isIn(['Work', 'Personal', 'Study', 'Health', 'Other']),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']),
  body('status').optional().isIn(['To Do', 'In Progress', 'Completed']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      let task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Make sure user owns the task
      if (task.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this task'
        });
      }

      // Update the task
      task = await Task.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      res.json({ success: true, task });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task removed'
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
