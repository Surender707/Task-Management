import { FiSearch, FiFilter } from 'react-icons/fi';

const TaskFilter = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    onFilterChange({
      search: '',
      status: '',
      priority: '',
      category: ''
    });
  };

  const hasActiveFilters = filters.search || filters.status || filters.priority || filters.category;

  return (
    <div className="task-filter" id="task-filter">
      <div className="filter-search">
        <FiSearch className="search-icon" />
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search tasks..."
          className="filter-search-input"
          id="filter-search-input"
        />
      </div>

      <div className="filter-selects">
        <div className="filter-select-wrapper">
          <FiFilter className="filter-icon" />
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="filter-select"
            id="filter-status"
          >
            <option value="">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <select
          name="priority"
          value={filters.priority}
          onChange={handleChange}
          className="filter-select"
          id="filter-priority"
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="filter-select"
          id="filter-category"
        >
          <option value="">All Categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>

        {hasActiveFilters && (
          <button className="filter-clear" onClick={handleClear} id="filter-clear">
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;
