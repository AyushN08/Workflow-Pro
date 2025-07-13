import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Kanban from './pages/Kanban';
import ProjectsPage from './pages/ProjectsPage';
import TeamsPage from './pages/TeamsPage';
import Dashboard from './pages/Dashboard'
import WorkflowCreationTool from './pages/WorkflowCreationTool';
import GitHubSuccess from './pages/GitHubSuccess';
import GoogleCalendarSuccess from './pages/GoogleCalendarSuccess';
;

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/WorkflowCreationTool" element={<WorkflowCreationTool />} />
          <Route path="/github-success" element={<GitHubSuccess />} />
          <Route path="/google-calendar-success" element={<GoogleCalendarSuccess />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;