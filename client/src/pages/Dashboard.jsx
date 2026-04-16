import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import { toast } from 'react-toastify';
import DashboardChart from '../components/DashboardChart';
import { FiTrendingUp, FiCheckCircle, FiClock, FiAlertCircle, FiZap, FiInfo, FiAward, FiPieChart } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await taskAPI.getAll();
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error('Dash error:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Compute stats safely
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter(t => (t.status || '') === 'Completed').length;
  const inProgressTasks = safeTasks.filter(t => (t.status || '') === 'In Progress').length;
  const overdueTasks = safeTasks.filter(t => {
    if (!t.dueDate || t.status === 'Completed') return false;
    return new Date(t.dueDate) < new Date();
  }).length;
  
  // Smart Logic: Productivity Score (0-100)
  const calculateProductivityScore = () => {
    if (totalTasks === 0) return 0;
    
    let score = 0;
    const weights = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
    
    safeTasks.forEach(task => {
      if (task.status === 'Completed') {
        score += weights[task.priority] || 1;
      }
    });
    
    const maxScore = safeTasks.reduce((acc, task) => acc + (weights[task.priority] || 1), 0);
    const penalty = overdueTasks * 0.5;
    
    return Math.max(0, Math.min(100, Math.round(((score - penalty) / (maxScore || 1)) * 100)));
  };

  const productivityScore = calculateProductivityScore();
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Smart Logic: Generate Insights
  const generateSmartInsights = () => {
    const insights = [];
    
    if (overdueTasks > 0) {
      insights.push({
        type: 'warning',
        icon: <FiAlertCircle />,
        title: 'Action Required',
        message: `You have ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}. Priority should be given to resolving these immediately.`
      });
    }

    const urgentRemaining = safeTasks.filter(t => t.priority === 'Urgent' && t.status !== 'Completed').length;
    if (urgentRemaining > 2) {
      insights.push({
        type: 'danger',
        icon: <FiZap />,
        title: 'High Pressure Detected',
        message: `Your urgent workload is high (${urgentRemaining} tasks). Consider focusing solely on these to avoid burnout.`
      });
    }

    const categoryCounts = safeTasks.reduce((acc, t) => {
      if (t.status !== 'Completed') {
        acc[t.category || 'Other'] = (acc[t.category || 'Other'] || 0) + 1;
      }
      return acc;
    }, {});
    
    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories.length > 0 ? sortedCategories[0] : null;
    
    if (topCategory && topCategory[1] > 3) {
      insights.push({
        type: 'info',
        icon: <FiInfo />,
        title: 'Strategic Focus',
        message: `Your ${topCategory[0]} backlog is growing. Dedicating a focus block here could significantly improve your throughput.`
      });
    }

    if (completionRate > 75 && totalTasks > 5) {
      insights.push({
        type: 'success',
        icon: <FiAward />,
        title: 'High Efficiency',
        message: "You're at the top of your game! Your completion rate is exceptional. Keep it up!"
      });
    }

    return insights.length > 0 ? insights : [{
      type: 'info',
      icon: <FiClock />,
      title: 'Data Gathering',
      message: 'Keep adding and completing tasks to unlock personalized AI insights about your productivity.'
    }];
  };

  const smartInsights = generateSmartInsights();

  const recentTasks = [...safeTasks]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page" id="dashboard-page">
      <div className="dashboard-header">
        <div className="header-text">
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name || 'User'}! Here's your intelligent overview.</p>
        </div>
        <div className="productivity-badge" id="productivity-score">
          <div className="score-ring">
            <span className="score-val">{productivityScore}%</span>
            <span className="score-label">Productivity</span>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="dash-stat-card" id="stat-total">
          <div className="dash-stat-icon total"><FiTrendingUp /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-number">{totalTasks}</span>
            <span className="dash-stat-label">Total Tasks</span>
          </div>
        </div>

        <div className="dash-stat-card" id="stat-completed">
          <div className="dash-stat-icon completed"><FiCheckCircle /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-number">{completedTasks}</span>
            <span className="dash-stat-label">Completed</span>
          </div>
        </div>

        <div className="dash-stat-card" id="stat-progress">
          <div className="dash-stat-icon progress"><FiClock /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-number">{inProgressTasks}</span>
            <span className="dash-stat-label">In Progress</span>
          </div>
        </div>

        <div className="dash-stat-card" id="stat-overdue">
          <div className="dash-stat-icon overdue"><FiAlertCircle /></div>
          <div className="dash-stat-info">
            <span className="dash-stat-number">{overdueTasks}</span>
            <span className="dash-stat-label">Overdue</span>
          </div>
        </div>
      </div>

      <div className="intelligence-grid">
        <div className="smart-insights-section" id="smart-insights">
          <h3><FiZap className="section-icon" /> Smart Insights</h3>
          <div className="insights-list">
            {smartInsights.map((insight, index) => (
              <div key={index} className={`insight-card ${insight.type}`}>
                <div className="insight-icon">{insight.icon}</div>
                <div className="insight-content">
                  <h4>{insight.title}</h4>
                  <p>{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="completion-stats-card">
          <h3><FiPieChart style={{marginRight: '8px'}} /> Completion Health</h3>
          <div className="completion-section">
            <div className="completion-bar-container">
              <div className="completion-bar">
                <div className="completion-fill" style={{ width: `${completionRate}%` }}></div>
              </div>
              <span className="completion-percentage">{completionRate}%</span>
            </div>
            <p className="completion-hint">Overall task resolution rate.</p>
          </div>
        </div>
      </div>

      {totalTasks > 0 ? (
        <DashboardChart tasks={safeTasks} />
      ) : (
        <div className="empty-state">
          <h3>No data yet</h3>
          <p>Create some tasks to see your analytics dashboard come alive!</p>
        </div>
      )}

      {recentTasks.length > 0 && (
        <div className="recent-tasks" id="recent-tasks">
          <h3>Recent Tasks</h3>
          <div className="recent-tasks-list">
            {recentTasks.map(task => (
              <div key={task._id} className="recent-task-item">
                <div className={`recent-task-status ${(task.status || 'To Do') === 'Completed' ? 'done' : (task.status || 'To Do') === 'In Progress' ? 'active' : 'pending'}`}></div>
                <div className="recent-task-info">
                  <span className="recent-task-title">{task.title}</span>
                  <span className="recent-task-meta">{task.category || 'Other'} • {task.priority || 'Medium'}</span>
                </div>
                <span className={`recent-task-badge ${(task.status || 'To Do').toLowerCase().replace(/\s/g, '-')}`}>
                  {task.status || 'To Do'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
