import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { 
  FiLogOut, 
  FiPlusCircle, 
  FiActivity, 
  FiClock, 
  FiTrendingUp, 
  FiZap,
  FiCheckCircle,
  FiAlertTriangle,
  FiPlay,
  FiPause,
  FiSettings,
  FiBarChart2,
  FiUsers,
  FiCalendar,
  FiFilter,
  FiSearch
} from 'react-icons/fi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut().then(() => navigate('/login'));
  };

  const stats = [
    { title: 'Active Agents', value: '12', change: '+2', icon: FiZap, color: 'from-blue-500 to-cyan-500' },
    { title: 'Tasks Completed', value: '1,247', change: '+18%', icon: FiCheckCircle, color: 'from-green-500 to-emerald-500' },
    { title: 'Time Saved', value: '47.2h', change: '+5.3h', icon: FiClock, color: 'from-purple-500 to-pink-500' },
    { title: 'Success Rate', value: '94.7%', change: '+2.1%', icon: FiTrendingUp, color: 'from-orange-500 to-red-500' }
  ];

  const recentAgents = [
    { name: 'Email Summarizer', status: 'running', lastRun: '2 mins ago', tasks: 156, category: 'Communication' },
    { name: 'Meeting Note Sync', status: 'completed', lastRun: '15 mins ago', tasks: 89, category: 'Productivity' },
    { name: 'Invoice Classifier', status: 'error', lastRun: '1 hour ago', tasks: 234, category: 'Finance' },
    { name: 'Weekly Digest Sender', status: 'scheduled', lastRun: '2 hours ago', tasks: 67, category: 'Communication' },
    { name: 'CRM Data Sync', status: 'running', lastRun: '5 mins ago', tasks: 198, category: 'Sales' },
    { name: 'Document Processor', status: 'completed', lastRun: '30 mins ago', tasks: 145, category: 'Documentation' }
  ];

  const upcomingTasks = [
    { name: 'Weekly Report Generation', time: 'Today at 5:00 PM', priority: 'high' },
    { name: 'Database Backup', time: 'Tomorrow at 2:00 AM', priority: 'medium' },
    { name: 'Client Data Sync', time: 'Friday at 10:00 AM', priority: 'low' },
    { name: 'Monthly Analytics', time: 'Next Monday at 9:00 AM', priority: 'high' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <FiPlay className="w-3 h-3" />;
      case 'completed': return <FiCheckCircle className="w-3 h-3" />;
      case 'error': return <FiAlertTriangle className="w-3 h-3" />;
      case 'scheduled': return <FiClock className="w-3 h-3" />;
      default: return <FiPause className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const filteredAgents = recentAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FiZap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Workflow-Pro
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'J'}
                </span>
              </div>
              <span className="text-sm text-gray-700 font-medium">{user?.displayName || user?.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <FiLogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.displayName?.split(' ')[0] || 'User'} 👋
              </h2>
              <p className="text-gray-600">Here's what's happening with your automation agents today.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/agents/create')}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FiPlusCircle className="w-5 h-5" /> Create Agent
              </button>
              <button className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <FiSettings className="w-5 h-5" /> Settings
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <DashboardCard key={index} {...stat} />
          ))}
        </section>

        {/* Navigation Tabs */}
        <section className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {['overview', 'agents', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent Status */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Active Agents</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <FiSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search agents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <FiFilter className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {filteredAgents.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FiZap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{agent.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{agent.tasks} tasks</span>
                          <span>•</span>
                          <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">{agent.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{agent.lastRun}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {getStatusIcon(agent.status)}
                        {agent.status}
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all">
                        <FiSettings className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/agents/create')}
                    className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all"
                  >
                    <FiPlusCircle className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-600">Create New Agent</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <FiBarChart2 className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">View Analytics</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <FiUsers className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Manage Team</span>
                  </button>
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className={`border-l-4 pl-4 py-3 rounded-r-lg ${getPriorityColor(task.priority)}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{task.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{task.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Task Success Rate</span>
                    <span className="text-sm font-medium">94.7%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '94.7%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Response Time</span>
                    <span className="text-sm font-medium">2.3s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Resource Usage</span>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-6">
            {/* Agents Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">All Agents</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <FiSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search agents..."
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>All Categories</option>
                    <option>Communication</option>
                    <option>Productivity</option>
                    <option>Finance</option>
                    <option>Sales</option>
                  </select>
                  <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    <FiPlusCircle className="w-4 h-4" /> New Agent
                  </button>
                </div>
              </div>
              
              {/* Agents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentAgents.map((agent, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FiZap className="w-6 h-6 text-white" />
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {getStatusIcon(agent.status)}
                        {agent.status}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{agent.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{agent.category}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{agent.tasks} tasks</span>
                      <span className="text-gray-500">{agent.lastRun}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg text-sm hover:bg-indigo-100 transition-colors">
                        Configure
                      </button>
                      <button className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                        View Logs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
              
              {/* Time Period Selector */}
              <div className="flex gap-2 mb-6">
                {['7 days', '30 days', '90 days', '1 year'].map((period) => (
                  <button
                    key={period}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {period}
                  </button>
                ))}
              </div>
              
              {/* Analytics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Task Completion Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Task Completion Rate</h4>
                  <div className="h-32 bg-white rounded flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600 mb-2">94.7%</div>
                      <div className="text-sm text-gray-500">Average completion rate</div>
                    </div>
                  </div>
                </div>
                
                {/* Response Time Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Average Response Time</h4>
                  <div className="h-32 bg-white rounded flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">2.3s</div>
                      <div className="text-sm text-gray-500">Average response time</div>
                    </div>
                  </div>
                </div>
                
                {/* Error Rate Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Error Rate</h4>
                  <div className="h-32 bg-white rounded flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600 mb-2">5.3%</div>
                      <div className="text-sm text-gray-500">Error rate this month</div>
                    </div>
                  </div>
                </div>
                
                {/* Resource Usage Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Resource Usage</h4>
                  <div className="h-32 bg-white rounded flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">67%</div>
                      <div className="text-sm text-gray-500">Current usage</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const DashboardCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
        {change}
      </span>
    </div>
    <div>
      <h4 className="text-2xl font-bold text-gray-900 mb-1">{value}</h4>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  </div>
);

export default Dashboard;