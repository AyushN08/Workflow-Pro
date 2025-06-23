import { Link } from 'react-router-dom';
import { FaTasks } from 'react-icons/fa';

const Navbar = () => (
  <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-slate-200/50 shadow-sm">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <FaTasks className="text-white text-lg" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Workflow-Pro
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200">
            Features
          </a>
          <a href="#pricing" className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200">
            Pricing
          </a>
          <a href="#about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200">
            About
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link 
            to="/login" 
            className="text-slate-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;