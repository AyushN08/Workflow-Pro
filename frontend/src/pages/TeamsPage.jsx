import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { teamService, projectService } from '../services/firebaseServices';
import { Plus, Users, Trash2, UserPlus, FolderOpen, Calendar, Settings } from 'lucide-react';

const TeamsPage = () => {
  const [user] = useAuthState(auth);
  const [teams, setTeams] = useState([]);
  const [teamProjects, setTeamProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    if (user) {
      loadTeams();
    }
  }, [user]);

  const loadTeams = async () => {
    try {
      const userTeams = await teamService.getUserTeams(user.uid);
      setTeams(userTeams);
      
      // Load projects for each team
      const projectsData = {};
      for (const team of userTeams) {
        try {
          const projects = await projectService.getTeamProjects(team.id);
          projectsData[team.id] = projects;
        } catch (error) {
          console.error(`Error loading projects for team ${team.id}:`, error);
          projectsData[team.id] = [];
        }
      }
      setTeamProjects(projectsData);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeam.name.trim()) return;
    
    try {
      await teamService.createTeam(newTeam, user.uid);
      setNewTeam({ name: '', description: '' });
      setShowCreateModal(false);
      loadTeams();
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error creating team. Please try again.');
    }
  };

  const handleDeleteTeam = async (teamId, teamName) => {
    const projectCount = teamProjects[teamId]?.length || 0;
    const message = projectCount > 0 
      ? `Are you sure you want to delete "${teamName}"? This will also delete ${projectCount} project(s) associated with this team. This action cannot be undone.`
      : `Are you sure you want to delete "${teamName}"? This action cannot be undone.`;
    
    if (window.confirm(message)) {
      try {
        // Delete all projects in the team first
        if (teamProjects[teamId]) {
          for (const project of teamProjects[teamId]) {
            await projectService.deleteProject(project.id);
          }
        }
        
        // Then delete the team
        await teamService.deleteTeam(teamId);
        loadTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Error deleting team. Please try again.');
      }
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    // For now, we'll just show an alert. In production, you'd implement email invitations
    alert(`Invitation would be sent to ${inviteEmail} for team "${selectedTeam.name}"`);
    setInviteEmail('');
    setShowInviteModal(false);
    setSelectedTeam(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return timestamp.toDate().toLocaleDateString();
    } catch (error) {
      return 'N/A';
    }
  };

  const getActiveProjectsCount = (teamId) => {
    const projects = teamProjects[teamId] || [];
    return projects.filter(p => p.status === 'active').length;
  };

  const getTotalProjectsCount = (teamId) => {
    return teamProjects[teamId]?.length || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-2">Manage your teams and workspaces</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Create Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
          <p className="text-gray-600 mb-4">Create your first team to start collaborating</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Create Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{team.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{team.members?.length || 0} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FolderOpen size={16} />
                      <span>{getTotalProjectsCount(team.id)} projects</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowInviteModal(true);
                    }}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    title="Invite Member"
                  >
                    <UserPlus size={18} />
                  </button>
                  {team.ownerId === user.uid && (
                    <button
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete Team"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{team.description || 'No description provided'}</p>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>Active Projects: {getActiveProjectsCount(team.id)}</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Created {formatDate(team.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <a
                    href={`/projects?team=${team.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg transition-colors text-sm"
                  >
                    View Projects
                  </a>
                  <button
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowInviteModal(true);
                    }}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                    title="Invite Member"
                  >
                    <UserPlus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
            <form onSubmit={handleCreateTeam}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Describe your team's purpose"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewTeam({ name: '', description: '' });
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">Invite Team Member</h2>
            <p className="text-gray-600 mb-4">Invite someone to join "{selectedTeam.name}"</p>
            <form onSubmit={handleInviteMember}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div className="mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This will send an email invitation to join your team. 
                    They will need to create an account if they don't have one.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setSelectedTeam(null);
                    setInviteEmail('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;