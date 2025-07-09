
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../firebase';
import { taskService, boardService, projectService } from '../services/firebaseServices';
import { Plus, Calendar, User, AlertCircle, MoreHorizontal, Edit3, Trash2, Users, ArrowLeft } from 'lucide-react';

const Kanban = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: ''
  });
  const [draggedTask, setDraggedTask] = useState(null);

  // Auth state management
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Load initial data
  useEffect(() => {
    if (user && !authLoading) {
      loadInitialData();
    }
  }, [user, authLoading, projectId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Check if projectService exists and has the method
      console.log('projectService:', projectService);
      console.log('projectService.getUserProjects:', projectService?.getUserProjects);
      
      // Check if services are properly imported
      if (!projectService) {
        throw new Error('projectService is not available');
      }
      
      if (typeof projectService.getUserProjects !== 'function') {
        throw new Error('projectService.getUserProjects is not a function');
      }
      
      // Load user's projects
      const userProjects = await projectService.getUserProjects(user.uid);
      setProjects(userProjects);
      
      if (projectId) {
        // Load specific project if projectId is provided
        await loadProjectData(projectId);
      } else if (userProjects.length > 0) {
        // Load first project if no specific project is selected
        await loadProjectData(userProjects[0].id);
      } else {
        // No projects available
        setShowProjectSelector(true);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectData = async (selectedProjectId) => {
    try {
      // Check if projectService.getProject exists
      if (typeof projectService.getProject !== 'function') {
        throw new Error('projectService.getProject is not a function');
      }
      
      // Load project details
      const projectData = await projectService.getProject(selectedProjectId);
      setCurrentProject(projectData);

      // Check if boardService exists
      if (!boardService || typeof boardService.getProjectBoards !== 'function') {
        throw new Error('boardService.getProjectBoards is not a function');
      }

      // Load boards for the project
      const projectBoards = await boardService.getProjectBoards(selectedProjectId);
      setBoards(projectBoards);
      
      if (projectBoards.length > 0) {
        const mainBoard = projectBoards[0];
        setCurrentBoard(mainBoard);
      } else {
        // Create a default board if none exists
        if (typeof boardService.createBoard !== 'function') {
          throw new Error('boardService.createBoard is not a function');
        }
        
        const defaultBoard = await boardService.createBoard({
          name: 'Main Board',
          projectId: selectedProjectId,
          columns: [
            { id: 'todo', title: 'To Do', order: 1 },
            { id: 'in-progress', title: 'In Progress', order: 2 },
            { id: 'done', title: 'Done', order: 3 }
          ]
        }, user.uid);
        setCurrentBoard(defaultBoard);
        setBoards([defaultBoard]);
      }
    } catch (error) {
      console.error('Error loading project data:', error);
      setError(`Failed to load project data: ${error.message}`);
    }
  };

  // Subscribe to task updates
  useEffect(() => {
    if (currentBoard && taskService && typeof taskService.subscribeToTasks === 'function') {
      const unsubscribe = taskService.subscribeToTasks(currentBoard.id, (updatedTasks) => {
        setTasks(updatedTasks);
      });
      
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [currentBoard]);

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !currentBoard) return;
    
    try {
      if (!taskService || typeof taskService.createTask !== 'function') {
        throw new Error('taskService.createTask is not available');
      }
      
      const taskData = {
        ...newTask,
        boardId: currentBoard.id,
        projectId: currentProject.id,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null
      };
      
      await taskService.createTask(taskData, user.uid);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: ''
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert(`Error creating task: ${error.message}`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        if (!taskService || typeof taskService.deleteTask !== 'function') {
          throw new Error('taskService.deleteTask is not available');
        }
        
        await taskService.deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert(`Error deleting task: ${error.message}`);
      }
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (draggedTask && draggedTask.status !== newStatus) {
      try {
        if (!taskService || typeof taskService.updateTask !== 'function') {
          throw new Error('taskService.updateTask is not available');
        }
        
        await taskService.updateTask(draggedTask.id, { status: newStatus });
        setDraggedTask(null);
      } catch (error) {
        console.error('Error updating task status:', error);
        alert(`Error updating task status: ${error.message}`);
      }
    }
  };

  const handleProjectChange = async (selectedProjectId) => {
    setShowProjectSelector(false);
    navigate(`/kanban?projectId=${selectedProjectId}`);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const taskDate = date.toDate ? date.toDate() : new Date(date);
    return taskDate.toLocaleDateString();
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your kanban board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Board</h3>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showProjectSelector || !currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Project</h2>
              <p className="text-gray-600">Choose a project to view its kanban board</p>
            </div>
            
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectChange(project.id)}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">No projects found. Create a project first.</p>
                <button
                  onClick={() => navigate('/projects')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Go to Projects
                </button>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const columns = currentBoard?.columns || [
    { id: 'todo', title: 'To Do', order: 1 },
    { id: 'in-progress', title: 'In Progress', order: 2 },
    { id: 'done', title: 'Done', order: 3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setShowProjectSelector(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Switch Project
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{currentProject?.name || 'Kanban Board'}</h1>
            <p className="text-gray-600 mt-2">Manage your tasks with drag-and-drop</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="bg-gray-50 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus(column.id).length}
                </span>
              </div>
              
              <div className="space-y-3">
                {getTasksByStatus(column.id).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className={`bg-white rounded-lg p-4 shadow-sm border-l-4 cursor-move hover:shadow-md transition-shadow ${getPriorityColor(task.priority)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                        {task.assignedTo && task.assignedTo.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users size={12} />
                            <span>{task.assignedTo.length}</span>
                          </div>
                        )}
                      </div>
                      
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Create Task Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateTask(); }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Describe the task"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewTask({
                        title: '',
                        description: '',
                        priority: 'medium',
                        status: 'todo',
                        dueDate: ''
                      });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kanban;