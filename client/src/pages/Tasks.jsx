import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import { toast } from 'react-toastify';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskFilter from '../components/TaskFilter';
import { FiPlus, FiInbox, FiDownload, FiZap } from 'react-icons/fi';
import Papa from 'papaparse';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskAPI.getAll();
      setTasks(res.data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data) => {
    try {
      const res = await taskAPI.create(data);
      setTasks([res.data.task, ...tasks]);
      setShowForm(false);
      toast.success('Task created successfully!');
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (data) => {
    try {
      const res = await taskAPI.update(editingTask._id, data);
      setTasks(tasks.map(t => t._id === editingTask._id ? res.data.task : t));
      setEditingTask(null);
      setShowForm(false);
      toast.success('Task updated successfully!');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.delete(id);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted!');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(t => t._id === active.id);
    const newIndex = tasks.findIndex(t => t._id === over.id);

    const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
    
    const updatedTasks = reorderedTasks.map((t, index) => ({
      ...t,
      order: index
    }));

    setTasks(updatedTasks);

    try {
      const payload = updatedTasks.map(t => ({ id: t._id, order: t.order }));
      await taskAPI.reorder(payload);
    } catch {
      toast.error('Failed to save task order');
    }
  };

  const handleExportCSV = () => {
    if (filteredTasks.length === 0) {
      toast.info('No tasks to export');
      return;
    }

    const exportData = filteredTasks.map(t => ({
      Title: t.title,
      Description: t.description,
      Category: t.category,
      Priority: t.priority,
      Status: t.status,
      'Due Date': t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A',
      'Created At': new Date(t.createdAt).toLocaleDateString()
    }));

    const csvContent = Papa.unparse(exportData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tasks_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Intelligence Logic: Focus Mode & Recommendations
  const getRecommendedTask = () => {
    const incompleteTasks = tasks.filter(t => t.status !== 'Completed');
    if (incompleteTasks.length === 0) return null;

    // Priority order: Urgent > High > Medium > Low
    const priorityWeights = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
    
    return incompleteTasks.sort((a, b) => {
      // Sort by priority weight
      const weightA = priorityWeights[a.priority] || 0;
      const weightB = priorityWeights[b.priority] || 0;
      if (weightB !== weightA) return weightB - weightA;
      
      // Secondary sort by due date
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      return 0;
    })[0];
  };

  const recommendedTask = getRecommendedTask();

  // Filter logic
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !task.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Status/Priority/Category filters
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.category && task.category !== filters.category) return false;
    
    // Intelligence Filter: Focus Mode (Only High/Urgent)
    if (focusMode && task.status !== 'Completed') {
      if (task.priority !== 'High' && task.priority !== 'Urgent') return false;
    }

    return true;
  });

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const todoTasks = tasks.filter(t => t.status === 'To Do').length;

  return (
    <div className="tasks-page" id="tasks-page">
      <div className="tasks-header">
        <div className="tasks-header-left">
          <h1>My Tasks</h1>
          <p className="tasks-greeting">Welcome, {user?.name}! You have {totalTasks} task{totalTasks !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="btn"
            style={{ backgroundColor: '#334155', color: '#fff' }}
            onClick={handleExportCSV}
            title="Export tasks to CSV"
          >
            <FiDownload /> Export CSV
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            id="create-task-btn"
          >
            <FiPlus /> New Task
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="tasks-stats">
        <div className="stat-item">
          <span className="stat-number">{totalTasks}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item todo">
          <span className="stat-number">{todoTasks}</span>
          <span className="stat-label">To Do</span>
        </div>
        <div className="stat-item in-progress">
          <span className="stat-number">{inProgressTasks}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-item completed">
          <span className="stat-number">{completedTasks}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {/* Intelligence Section: Smart Highlight & Focus Mode */}
      <div className="smart-highlight-section">
        <div className="highlight-content">
          <h4><FiZap /> Recommended Next Task</h4>
          {recommendedTask ? (
            <div className="highlight-title">
              {recommendedTask.title} <span className="highlight-tag">({recommendedTask.priority})</span>
            </div>
          ) : (
            <div className="highlight-title">All caught up! 🎉</div>
          )}
        </div>
        <div className="focus-toggle-container">
          <span className="focus-label">Focus Mode</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={focusMode} 
              onChange={() => setFocusMode(!focusMode)} 
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Filters */}
      <TaskFilter filters={filters} onFilterChange={setFilters} />

      {/* Task List */}
      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state" id="empty-tasks">
          <FiInbox className="empty-icon" />
          <h3>{tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}</h3>
          <p>{tasks.length === 0 ? 'Create your first task to get started!' : 'Try adjusting your filters'}</p>
          {tasks.length === 0 && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <FiPlus /> Create First Task
            </button>
          )}
        </div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={filteredTasks.map(t => t._id)}
            strategy={rectSortingStrategy}
          >
            <div className="tasks-grid">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          key={editingTask?._id || 'new-task'}
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Tasks;
