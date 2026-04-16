import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCheckSquare, FiBarChart2, FiShield, FiZap, FiLayers, FiArrowRight } from 'react-icons/fi';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page" id="landing-page">
      {/* Animated Background */}
      <div className="landing-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <FiZap /> Intelligent Task Management
          </div>
          <h1 className="hero-title">
            Organize Your Life with
            <span className="gradient-text"> TaskFlow</span>
          </h1>
          <p className="hero-subtitle">
            A powerful, intelligent task management application built with the MERN Stack.
            Create, organize, prioritize, and track your tasks with beautiful analytics.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/tasks" className="btn btn-primary btn-lg" id="hero-cta">
                Go to Tasks <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg" id="hero-cta">
                  Get Started Free <FiArrowRight />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg" id="hero-login">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="hero-mock-card card-1">
              <div className="mock-badge urgent">Urgent</div>
              <div className="mock-title">Complete Project Report</div>
              <div className="mock-meta">📚 Study • Due Tomorrow</div>
            </div>
            <div className="hero-mock-card card-2">
              <div className="mock-badge medium">Medium</div>
              <div className="mock-title">Team Meeting Prep</div>
              <div className="mock-meta">💼 Work • In Progress</div>
            </div>
            <div className="hero-mock-card card-3">
              <div className="mock-badge completed">✓ Done</div>
              <div className="mock-title">Morning Workout</div>
              <div className="mock-meta">🏃 Health • Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features-section">
        <h2 className="section-title">Why TaskFlow?</h2>
        <p className="section-subtitle">Everything you need to stay productive and organized</p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FiCheckSquare />
            </div>
            <h3>Task Management</h3>
            <p>Create, organize, and track tasks with priorities, categories, and due dates. Full CRUD operations at your fingertips.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FiBarChart2 />
            </div>
            <h3>Visual Analytics</h3>
            <p>Beautiful charts and dashboards to visualize your productivity. Track status, priorities, and category distributions.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FiShield />
            </div>
            <h3>Secure Auth</h3>
            <p>JWT-based authentication with bcrypt password hashing. Your data is protected with industry-standard security.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FiZap />
            </div>
            <h3>Fast & Modern</h3>
            <p>Built with React and Vite for blazing-fast performance. Responsive design that works beautifully on any device.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FiLayers />
            </div>
            <h3>MERN Stack</h3>
            <p>Full-stack JavaScript with MongoDB, Express.js, React.js, and Node.js. Modern architecture, scalable design.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FiBarChart2 />
            </div>
            <h3>Smart Filtering</h3>
            <p>Search and filter tasks by status, priority, or category. Find exactly what you need in seconds.</p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-stack" id="tech-section">
        <h2 className="section-title">Built With</h2>
        <div className="tech-grid">
          <div className="tech-item">
            <div className="tech-letter">M</div>
            <div className="tech-name">MongoDB</div>
            <div className="tech-desc">NoSQL Database</div>
          </div>
          <div className="tech-item">
            <div className="tech-letter">E</div>
            <div className="tech-name">Express.js</div>
            <div className="tech-desc">Backend Framework</div>
          </div>
          <div className="tech-item">
            <div className="tech-letter">R</div>
            <div className="tech-name">React.js</div>
            <div className="tech-desc">Frontend Library</div>
          </div>
          <div className="tech-item">
            <div className="tech-letter">N</div>
            <div className="tech-name">Node.js</div>
            <div className="tech-desc">Runtime Environment</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>TaskFlow — Intelligent Task Management Application</p>
        <p className="footer-sub">Built as an Internship Project • MERN Stack • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Landing;
