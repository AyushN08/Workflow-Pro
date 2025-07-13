// src/pages/GitHubSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GitHubSuccess = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [repos, setRepos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get('token');
    const user = query.get('username');

    setToken(accessToken);
    setUsername(user);

    if (accessToken) {
      fetch(`http://localhost:5000/api/github/repos`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(res => res.json())
        .then(data => setRepos(data))
        .catch(err => console.error('Failed to fetch repos:', err));
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>
      <h2 className="text-xl font-semibold mb-2">Your GitHub Repositories</h2>
      <ul className="list-disc ml-6 text-blue-600">
        {repos.length > 0 ? (
          repos.map(repo => (
            <li key={repo.id}>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
            </li>
          ))
        ) : (
          <p>Loading or no repos found...</p>
        )}
      </ul>
    </div>
  );
};

export default GitHubSuccess;
