import React, { useEffect, useState } from 'react';
import { Github, GitBranch, Star, Eye, Code, Calendar, ExternalLink, Loader2, RefreshCw } from 'lucide-react';

const GitHubSuccess = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get('token');
    const user = query.get('username');

    setToken(accessToken);
    setUsername(user);

    if (accessToken) {
      fetchRepos(accessToken);
    }
  }, []);

  const fetchRepos = async (accessToken) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/github/repos`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      
      const data = await response.json();
      setRepos(data);
    } catch (err) {
      setError('Failed to fetch repositories');
      console.error('Failed to fetch repos:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: 'bg-yellow-400',
      Python: 'bg-blue-500',
      Java: 'bg-red-500',
      TypeScript: 'bg-blue-600',
      HTML: 'bg-orange-500',
      CSS: 'bg-purple-500',
      React: 'bg-cyan-500',
      Node: 'bg-green-500',
      default: 'bg-gray-500'
    };
    return colors[language] || colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your repositories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 p-3 rounded-xl">
                <Github className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {username}! 👋
                </h1>
                <p className="text-gray-600">Here's what's happening with your GitHub repositories today.</p>
              </div>
            </div>
            <button
              onClick={() => fetchRepos(token)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-green-600 text-sm font-medium">+{repos.length > 0 ? Math.floor(repos.length / 10) : 0}</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{repos.length}</p>
              <p className="text-gray-600 text-sm">Total Repositories</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-green-600 text-sm font-medium">+{repos.reduce((acc, repo) => acc + repo.stargazers_count, 0) > 0 ? Math.floor(repos.reduce((acc, repo) => acc + repo.stargazers_count, 0) / 10) : 0}</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)}
              </p>
              <p className="text-gray-600 text-sm">Total Stars</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <GitBranch className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-medium">+{repos.filter(repo => !repo.private).length > 0 ? Math.floor(repos.filter(repo => !repo.private).length / 5) : 0}</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {repos.filter(repo => !repo.private).length}
              </p>
              <p className="text-gray-600 text-sm">Public Repos</p>
            </div>
          </div>
        </div>

        {/* Repositories Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Repositories</h2>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Repositories Grid */}
        {repos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {repo.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {repo.description || 'No description available'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    {repo.private ? (
                      <div className="w-2 h-2 bg-orange-500 rounded-full" title="Private" />
                    ) : (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Public" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  {repo.language && (
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />
                      <span>{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{repo.watchers_count}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Updated {formatDate(repo.updated_at)}</span>
                  </div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">View</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Github className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
            <p className="text-gray-600 text-lg">No repositories found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubSuccess;