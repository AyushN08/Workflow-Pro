// services/firebaseServices.js - Complete backend logic for Phase 1
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { auth,  db } from '../firebase';

// TEAM MANAGEMENT
export const teamService = {
  // Create new team
  async createTeam(teamData, userId) {
    try {
      const docRef = await addDoc(collection(db, 'teams'), {
        ...teamData,
        ownerId: userId,
        members: [userId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  },

  // Get user's teams
  async getUserTeams(userId) {
    try {
      const q = query(
        collection(db, 'teams'),
        where('members', 'array-contains', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  // Add member to team
  async addMember(teamId, userId) {
    try {
      const teamRef = doc(db, 'teams', teamId);
      await updateDoc(teamRef, {
        members: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  // Remove member from team
  async removeMember(teamId, userId) {
    try {
      const teamRef = doc(db, 'teams', teamId);
      await updateDoc(teamRef, {
        members: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  },

  // Update team
  async updateTeam(teamId, updateData) {
    try {
      const teamRef = doc(db, 'teams', teamId);
      await updateDoc(teamRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  },

  // Delete team
  async deleteTeam(teamId) {
    try {
      await deleteDoc(doc(db, 'teams', teamId));
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }
};

// PROJECT MANAGEMENT
export const projectService = {
  // Create new project
  async createProject(projectData, userId) {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        status: 'active',
        createdBy: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Get team projects
  async getTeamProjects(teamId) {
    try {
      const q = query(
        collection(db, 'projects'),
        where('teamId', '==', teamId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Update project
  async updateProject(projectId, updateData) {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  async deleteProject(projectId) {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};

// BOARD MANAGEMENT
export const boardService = {
  // Create default board for project
  async createBoard(projectId, boardName = 'Main Board') {
    try {
      const docRef = await addDoc(collection(db, 'boards'), {
        projectId,
        name: boardName,
        columns: [
          { id: 'todo', title: 'To Do', order: 1 },
          { id: 'in-progress', title: 'In Progress', order: 2 },
          { id: 'done', title: 'Done', order: 3 }
        ],
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  },

  // Get project boards
  async getProjectBoards(projectId) {
    try {
      const q = query(
        collection(db, 'boards'),
        where('projectId', '==', projectId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  },

  // Update board columns
  async updateBoardColumns(boardId, columns) {
    try {
      const boardRef = doc(db, 'boards', boardId);
      await updateDoc(boardRef, {
        columns: columns
      });
    } catch (error) {
      console.error('Error updating board columns:', error);
      throw error;
    }
  }
};

// TASK MANAGEMENT
export const taskService = {
  // Create new task
  async createTask(taskData, userId) {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        assignedTo: taskData.assignedTo || [],
        createdBy: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        order: taskData.order || 0
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Get board tasks
  async getBoardTasks(boardId) {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('boardId', '==', boardId),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Update task
  async updateTask(taskId, updateData) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Assign user to task
  async assignUser(taskId, userId) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        assignedTo: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error assigning user:', error);
      throw error;
    }
  },

  // Unassign user from task
  async unassignUser(taskId, userId) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        assignedTo: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error unassigning user:', error);
      throw error;
    }
  },

  // Delete task
  async deleteTask(taskId) {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Real-time listener for tasks
  subscribeToTasks(boardId, callback) {
    const q = query(
      collection(db, 'tasks'),
      where('boardId', '==', boardId),
      orderBy('order', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(tasks);
    });
  }
};

// SPRINT MANAGEMENT
export const sprintService = {
  // Create new sprint
  async createSprint(sprintData, userId) {
    try {
      const docRef = await addDoc(collection(db, 'sprints'), {
        ...sprintData,
        status: 'planning',
        goals: sprintData.goals || [],
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating sprint:', error);
      throw error;
    }
  },

  // Get project sprints
  async getProjectSprints(projectId) {
    try {
      const q = query(
        collection(db, 'sprints'),
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching sprints:', error);
      throw error;
    }
  },

  // Update sprint
  async updateSprint(sprintId, updateData) {
    try {
      const sprintRef = doc(db, 'sprints', sprintId);
      await updateDoc(sprintRef, updateData);
    } catch (error) {
      console.error('Error updating sprint:', error);
      throw error;
    }
  },

  // Start sprint
  async startSprint(sprintId) {
    try {
      const sprintRef = doc(db, 'sprints', sprintId);
      await updateDoc(sprintRef, {
        status: 'active',
        startDate: serverTimestamp()
      });
    } catch (error) {
      console.error('Error starting sprint:', error);
      throw error;
    }
  },

  // Complete sprint
  async completeSprint(sprintId) {
    try {
      const sprintRef = doc(db, 'sprints', sprintId);
      await updateDoc(sprintRef, {
        status: 'completed',
        endDate: serverTimestamp()
      });
    } catch (error) {
      console.error('Error completing sprint:', error);
      throw error;
    }
  }
};