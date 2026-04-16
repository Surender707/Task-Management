import { FiEdit2, FiTrash2, FiCalendar, FiFlag, FiFolder, FiMove } from 'react-icons/fi';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const priorityColors = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#f97316',
  Urgent: '#ef4444'
};

const statusColors = {
  'To Do': '#6366f1',
  'In Progress': '#f59e0b',
  'Completed': '#10b981'
};

const categoryIcons = {
  Work: '💼',
  Personal: '👤',
  Study: '📚',
  Health: '🏃',
  Other: '📌'
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'Completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
    position: 'relative',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`task-card ${task.status === 'Completed' ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''} ${isDragging ? 'dragging' : ''}`} 
      id={`task-card-${task._id}`}
    >
      <div className="task-card-header">
        <div className="task-category">
          <div className="drag-handle" {...attributes} {...listeners} style={{ cursor: 'grab', marginRight: '8px', display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
            <FiMove />
          </div>
          <span className="category-emoji">{categoryIcons[task.category] || '📌'}</span>
          <span className="category-text">{task.category}</span>
        </div>
        <div className="task-actions">
          <button
            className="task-action-btn edit"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            id={`edit-task-${task._id}`}
          >
            <FiEdit2 />
          </button>
          <button
            className="task-action-btn delete"
            onClick={() => onDelete(task._id)}
            aria-label="Delete task"
            id={`delete-task-${task._id}`}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span
          className="task-badge priority"
          style={{ backgroundColor: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority], borderColor: `${priorityColors[task.priority]}40` }}
        >
          <FiFlag />
          {task.priority}
        </span>

        <span
          className="task-badge status"
          style={{ backgroundColor: `${statusColors[task.status]}20`, color: statusColors[task.status], borderColor: `${statusColors[task.status]}40` }}
        >
          {task.status}
        </span>
      </div>

      {task.dueDate && (
        <div className={`task-due-date ${isOverdue() ? 'overdue-text' : ''}`}>
          <FiCalendar />
          <span>{isOverdue() ? 'Overdue: ' : 'Due: '}{formatDate(task.dueDate)}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
