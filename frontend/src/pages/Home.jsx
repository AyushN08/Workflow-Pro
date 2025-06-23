import Navbar from '../components/Navbar.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import { FaTasks, FaClock, FaFileAlt, FaComments, FaChartLine, FaArrowRight, FaCheck, FaStar } from 'react-icons/fa';

const features = [
  { 
    title: "Project Management", 
    description: "Organize work with intuitive Kanban boards, sprints, and task dependencies.", 
    icon: <FaTasks /> 
  },
  { 
    title: "Time Tracking", 
    description: "Track hours effortlessly and analyze productivity with detailed insights.", 
    icon: <FaClock /> 
  },
  { 
    title: "File Sharing", 
    description: "Secure, version-controlled storage with real-time collaboration.", 
    icon: <FaFileAlt /> 
  },
  { 
    title: "Real-time Chat", 
    description: "Collaborate with your team instantly with built-in messaging.", 
    icon: <FaComments /> 
  },
  { 
    title: "Analytics Dashboard", 
    description: "Comprehensive reports and performance insights at your fingertips.", 
    icon: <FaChartLine /> 
  },
];

const Home = () => (
  <div className="min-h-screen">
    <Navbar />
    
    {/* Hero Section */}
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-full text-sm font-medium text-blue-700 mb-8">
          <FaStar className="mr-2 text-yellow-500" />
          Trusted by 10,000+ teams worldwide
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-8 leading-tight">
          All-in-One Workspace for{' '}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Remote Teams
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          Streamline your workflow with our comprehensive platform. Manage projects, track time, 
          share files, and collaborate seamlessly — all in one beautifully designed workspace.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="/signup" 
            className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 flex items-center"
          >
            Get Started for Free
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
          <a 
            href="#features" 
            className="px-8 py-4 text-lg font-semibold text-slate-700 hover:text-blue-600 transition-colors duration-200"
          >
            Watch Demo
          </a>
        </div>
        
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-slate-500">
          <div className="flex items-center">
            <FaCheck className="text-green-500 mr-2" />
            No credit card required
          </div>
          <div className="flex items-center">
            <FaCheck className="text-green-500 mr-2" />
            14-day free trial
          </div>
          <div className="flex items-center">
            <FaCheck className="text-green-500 mr-2" />
            Cancel anytime
          </div>
        </div>
      </div>
    </header>

    {/* Stats Section */}
    <section className="py-20 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
              10,000+
            </div>
            <p className="text-slate-600 font-medium">Teams Trust Us</p>
          </div>
          <div className="text-center group">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
              99.9%
            </div>
            <p className="text-slate-600 font-medium">Uptime Guaranteed</p>
          </div>
          <div className="text-center group">
            <div className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
              50M+
            </div>
            <p className="text-slate-600 font-medium">Tasks Completed</p>
          </div>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              succeed
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features designed to streamline your workflow and boost team productivity
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      <div className="relative max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to transform your workflow?
        </h2>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
          Join thousands of teams who have already revolutionized their productivity
        </p>
        <a 
          href="/signup" 
          className="inline-flex items-center bg-white text-blue-600 px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          Start Your Free Trial
          <FaArrowRight className="ml-3" />
        </a>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-slate-900 text-center py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FaTasks className="text-white text-sm" />
          </div>
          <span className="text-2xl font-bold text-white">Workflow-Pro</span>
        </div>
        <p className="text-slate-400 mb-6">
          Empowering teams to achieve more, together.
        </p>
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Workflow-Pro. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
);

export default Home;