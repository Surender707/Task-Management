import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardChart = ({ tasks }) => {
  // Status distribution data
  const statusCounts = {
    'To Do': tasks.filter(t => t.status === 'To Do').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    'Completed': tasks.filter(t => t.status === 'Completed').length
  };

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)'
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(16, 185, 129, 1)'
      ],
      borderWidth: 2,
      hoverOffset: 8
    }]
  };

  // Priority distribution data
  const priorityCounts = {
    Low: tasks.filter(t => t.priority === 'Low').length,
    Medium: tasks.filter(t => t.priority === 'Medium').length,
    High: tasks.filter(t => t.priority === 'High').length,
    Urgent: tasks.filter(t => t.priority === 'Urgent').length
  };

  const priorityData = {
    labels: Object.keys(priorityCounts),
    datasets: [{
      label: 'Tasks by Priority',
      data: Object.values(priorityCounts),
      backgroundColor: [
        'rgba(16, 185, 129, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(249, 115, 22, 0.7)',
        'rgba(239, 68, 68, 0.7)'
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(249, 115, 22, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2,
      borderRadius: 8
    }]
  };

  // Category distribution data
  const categoryCounts = {
    Work: tasks.filter(t => t.category === 'Work').length,
    Personal: tasks.filter(t => t.category === 'Personal').length,
    Study: tasks.filter(t => t.category === 'Study').length,
    Health: tasks.filter(t => t.category === 'Health').length,
    Other: tasks.filter(t => t.category === 'Other').length
  };

  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [{
      data: Object.values(categoryCounts),
      backgroundColor: [
        'rgba(99, 102, 241, 0.7)',
        'rgba(236, 72, 153, 0.7)',
        'rgba(14, 165, 233, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(156, 163, 175, 0.7)'
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(14, 165, 233, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(156, 163, 175, 1)'
      ],
      borderWidth: 2,
      hoverOffset: 8
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          padding: 16,
          font: { size: 12, family: 'Inter' },
          usePointStyle: true,
          pointStyleWidth: 10
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleFont: { family: 'Inter' },
        bodyFont: { family: 'Inter' },
        padding: 12,
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1
      }
    },
    cutout: '65%'
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleFont: { family: 'Inter' },
        bodyFont: { family: 'Inter' },
        padding: 12,
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter' } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter' },
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="charts-grid">
      <div className="chart-card" id="status-chart">
        <h3 className="chart-title">Task Status</h3>
        <div className="chart-wrapper">
          <Doughnut data={statusData} options={doughnutOptions} />
        </div>
      </div>

      <div className="chart-card" id="priority-chart">
        <h3 className="chart-title">Priority Distribution</h3>
        <div className="chart-wrapper">
          <Bar data={priorityData} options={barOptions} />
        </div>
      </div>

      <div className="chart-card" id="category-chart">
        <h3 className="chart-title">Categories</h3>
        <div className="chart-wrapper">
          <Doughnut data={categoryData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;
