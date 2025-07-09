import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ArrowLeft, 
  Settings, 
  Mail, 
  MessageSquare, 
  Database, 
  FileText, 
  CheckCircle, 
  Globe,
  Trash2,
  Save,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Copy,
  Play,
  X
} from 'lucide-react';

const WorkflowCreationTool = () => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [steps, setSteps] = useState([]);
  const [showStepSelector, setShowStepSelector] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState(new Set());

  // Available step types
  const stepTypes = [
    {
      id: 'email',
      name: 'Send Email',
      icon: Mail,
      color: 'bg-blue-500',
      description: 'Send automated emails to specified recipients'
    },
    {
      id: 'slack',
      name: 'Post to Slack',
      icon: MessageSquare,
      color: 'bg-green-500',
      description: 'Send messages to Slack channels or users'
    },
    {
      id: 'database',
      name: 'Update Database',
      icon: Database,
      color: 'bg-purple-500',
      description: 'Create, update, or delete database records'
    },
    {
      id: 'summary',
      name: 'Generate Summary',
      icon: FileText,
      color: 'bg-orange-500',
      description: 'Create AI-powered summaries of content'
    },
    {
      id: 'approval',
      name: 'Request Approval',
      icon: CheckCircle,
      color: 'bg-yellow-500',
      description: 'Send approval requests to team members'
    },
    {
      id: 'api',
      name: 'API Call',
      icon: Globe,
      color: 'bg-red-500',
      description: 'Make HTTP requests to external APIs'
    }
  ];

  // Add a new step
  const addStep = (stepType) => {
    const newStep = {
      id: Date.now(),
      type: stepType.id,
      name: stepType.name,
      icon: stepType.icon,
      color: stepType.color,
      config: getDefaultConfig(stepType.id),
      order: steps.length + 1
    };
    setSteps([...steps, newStep]);
    setEditingStep(newStep.id);
    setShowStepSelector(false);
    setExpandedSteps(new Set([...expandedSteps, newStep.id]));
  };

  // Get default configuration for each step type
  const getDefaultConfig = (stepType) => {
    switch (stepType) {
      case 'email':
        return {
          to: '',
          subject: '',
          body: '',
          template: 'default'
        };
      case 'slack':
        return {
          channel: '',
          message: '',
          username: 'WorkflowBot'
        };
      case 'database':
        return {
          action: 'create',
          table: '',
          data: {}
        };
      case 'summary':
        return {
          source: '',
          length: 'medium',
          format: 'paragraph'
        };
      case 'approval':
        return {
          approvers: [],
          message: '',
          deadline: ''
        };
      case 'api':
        return {
          method: 'GET',
          url: '',
          headers: {},
          body: ''
        };
      default:
        return {};
    }
  };

  // Update step configuration
  const updateStepConfig = (stepId, config) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, config } : step
    ));
  };

  // Delete step
  const deleteStep = (stepId) => {
    setSteps(steps.filter(step => step.id !== stepId));
    setExpandedSteps(new Set([...expandedSteps].filter(id => id !== stepId)));
  };

  // Duplicate step
  const duplicateStep = (stepId) => {
    const stepToDuplicate = steps.find(step => step.id === stepId);
    if (stepToDuplicate) {
      const newStep = {
        ...stepToDuplicate,
        id: Date.now(),
        order: steps.length + 1
      };
      setSteps([...steps, newStep]);
    }
  };

  // Toggle step expansion
  const toggleStepExpansion = (stepId) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  // Render step configuration form
  const renderStepConfig = (step) => {
    const { config } = step;
    
    switch (step.type) {
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients (comma-separated)
              </label>
              <input
                type="text"
                value={config.to}
                onChange={(e) => updateStepConfig(step.id, { ...config, to: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com, team@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={config.subject}
                onChange={(e) => updateStepConfig(step.id, { ...config, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Body
              </label>
              <textarea
                value={config.body}
                onChange={(e) => updateStepConfig(step.id, { ...config, body: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Email message content"
              />
            </div>
          </div>
        );
        
      case 'slack':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channel/User
              </label>
              <input
                type="text"
                value={config.channel}
                onChange={(e) => updateStepConfig(step.id, { ...config, channel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#general or @username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={config.message}
                onChange={(e) => updateStepConfig(step.id, { ...config, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Message to send"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bot Username
              </label>
              <input
                type="text"
                value={config.username}
                onChange={(e) => updateStepConfig(step.id, { ...config, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="WorkflowBot"
              />
            </div>
          </div>
        );
        
      case 'database':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action
              </label>
              <select
                value={config.action}
                onChange={(e) => updateStepConfig(step.id, { ...config, action: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="create">Create Record</option>
                <option value="update">Update Record</option>
                <option value="delete">Delete Record</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Table/Collection
              </label>
              <input
                type="text"
                value={config.table}
                onChange={(e) => updateStepConfig(step.id, { ...config, table: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="users, projects, tasks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data (JSON format)
              </label>
              <textarea
                value={JSON.stringify(config.data, null, 2)}
                onChange={(e) => {
                  try {
                    const data = JSON.parse(e.target.value);
                    updateStepConfig(step.id, { ...config, data });
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                rows="4"
                placeholder='{"field": "value"}'
              />
            </div>
          </div>
        );
        
      case 'summary':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Content
              </label>
              <textarea
                value={config.source}
                onChange={(e) => updateStepConfig(step.id, { ...config, source: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Content to summarize or data source"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary Length
              </label>
              <select
                value={config.length}
                onChange={(e) => updateStepConfig(step.id, { ...config, length: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="short">Short (1-2 sentences)</option>
                <option value="medium">Medium (3-5 sentences)</option>
                <option value="long">Long (6+ sentences)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Format
              </label>
              <select
                value={config.format}
                onChange={(e) => updateStepConfig(step.id, { ...config, format: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="paragraph">Paragraph</option>
                <option value="bullet">Bullet Points</option>
                <option value="numbered">Numbered List</option>
              </select>
            </div>
          </div>
        );
        
      case 'approval':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approvers (comma-separated emails)
              </label>
              <input
                type="text"
                value={config.approvers.join(', ')}
                onChange={(e) => updateStepConfig(step.id, { ...config, approvers: e.target.value.split(',').map(email => email.trim()) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="manager@company.com, lead@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval Message
              </label>
              <textarea
                value={config.message}
                onChange={(e) => updateStepConfig(step.id, { ...config, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Request approval for..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="datetime-local"
                value={config.deadline}
                onChange={(e) => updateStepConfig(step.id, { ...config, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
        
      case 'api':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTTP Method
              </label>
              <select
                value={config.method}
                onChange={(e) => updateStepConfig(step.id, { ...config, method: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                type="url"
                value={config.url}
                onChange={(e) => updateStepConfig(step.id, { ...config, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headers (JSON format)
              </label>
              <textarea
                value={JSON.stringify(config.headers, null, 2)}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value);
                    updateStepConfig(step.id, { ...config, headers });
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                rows="3"
                placeholder='{"Authorization": "Bearer token"}'
              />
            </div>
            {config.method !== 'GET' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Body
                </label>
                <textarea
                  value={config.body}
                  onChange={(e) => updateStepConfig(step.id, { ...config, body: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Request body content"
                />
              </div>
            )}
          </div>
        );
        
      default:
        return <div className="text-gray-500">No configuration available for this step type.</div>;
    }
  };

  // Save workflow
  const saveWorkflow = () => {
    if (!workflowName.trim()) {
      alert('Please enter a workflow name');
      return;
    }
    
    if (steps.length === 0) {
      alert('Please add at least one step to the workflow');
      return;
    }
    
    const workflow = {
      name: workflowName,
      description: workflowDescription,
      steps: steps,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    console.log('Saving workflow:', workflow);
    alert('Workflow saved successfully!');
    // Here you would typically save to your database
  };

  // Test workflow
  const testWorkflow = () => {
    if (steps.length === 0) {
      alert('Please add at least one step to test the workflow');
      return;
    }
    
    console.log('Testing workflow:', { name: workflowName, steps });
    alert('Workflow test initiated! Check console for details.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => console.log('Navigate to dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 transition-colors ${
                previewMode ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye size={20} />
              {previewMode ? 'Exit Preview' : 'Preview Mode'}
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Workflow</h1>
          <p className="text-gray-600">Design automated workflows with custom steps and actions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workflow Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Workflow Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workflow Name *
                  </label>
                  <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter workflow name"
                    disabled={previewMode}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Describe what this workflow does"
                    disabled={previewMode}
                  />
                </div>
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Workflow Steps</h2>
                {!previewMode && (
                  <button
                    onClick={() => setShowStepSelector(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus size={20} />
                    Add Step
                  </button>
                )}
              </div>

              {/* Steps List */}
              <div className="space-y-4">
                {steps.length === 0 ? (
                  <div className="text-center py-12">
                    <Settings size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No steps added yet</h3>
                    <p className="text-gray-500 mb-4">Add your first step to start building your workflow</p>
                    {!previewMode && (
                      <button
                        onClick={() => setShowStepSelector(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Add First Step
                      </button>
                    )}
                  </div>
                ) : (
                  steps.map((step, index) => {
                    const IconComponent = step.icon;
                    const isExpanded = expandedSteps.has(step.id);
                    
                    return (
                      <div key={step.id} className="border border-gray-200 rounded-lg">
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                                  {index + 1}
                                </span>
                                <div className={`p-2 rounded-lg ${step.color} text-white`}>
                                  <IconComponent size={20} />
                                </div>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{step.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {stepTypes.find(type => type.id === step.type)?.description}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {!previewMode && (
                                <>
                                  <button
                                    onClick={() => duplicateStep(step.id)}
                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    title="Duplicate step"
                                  >
                                    <Copy size={16} />
                                  </button>
                                  <button
                                    onClick={() => deleteStep(step.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Delete step"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => toggleStepExpansion(step.id)}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <h4 className="font-medium text-gray-900 mb-3">Step Configuration</h4>
                              {previewMode ? (
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {JSON.stringify(step.config, null, 2)}
                                  </pre>
                                </div>
                              ) : (
                                renderStepConfig(step)
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={saveWorkflow}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save size={20} />
                  Save Workflow
                </button>
                
                <button
                  onClick={testWorkflow}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Play size={20} />
                  Test Workflow
                </button>
              </div>
            </div>

            {/* Workflow Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Steps:</span>
                  <span className="font-medium">{steps.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm">
                    Draft
                  </span>
                </div>
                
                {steps.length > 0 && (
                  <div>
                    <span className="text-gray-600 block mb-2">Step Types:</span>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(steps.map(step => step.type))].map(type => {
                        const stepType = stepTypes.find(t => t.id === type);
                        return (
                          <span key={type} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                            {stepType?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step Selector Modal */}
        {showStepSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Choose Step Type</h2>
                <button
                  onClick={() => setShowStepSelector(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stepTypes.map((stepType) => {
                  const IconComponent = stepType.icon;
                  return (
                    <button
                      key={stepType.id}
                      onClick={() => addStep(stepType)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${stepType.color} text-white`}>
                          <IconComponent size={20} />
                        </div>
                        <h3 className="font-medium text-gray-900">{stepType.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500">{stepType.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowCreationTool;