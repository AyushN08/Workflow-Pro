const FeatureCard = ({ title, description, icon }) => (
  <div className="group relative bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-3 cursor-pointer">
    {/* Gradient overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/40 to-pink-50/80 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    {/* Animated border effect */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
    
    <div className="relative z-10">
      {/* Icon container */}
      <div className="w-18 h-18 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
        <div className="text-2xl text-white drop-shadow-sm">{icon}</div>
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
        {description}
      </p>
      
      {/* Hover indicator */}
      <div className="mt-6 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <span className="text-sm font-medium">Learn more</span>
        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
);

export default FeatureCard;