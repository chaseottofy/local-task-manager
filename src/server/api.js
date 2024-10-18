// Task Manager API Client
import handleError from '../utils/handle-fetch-error';

const API_URL = 'http://localhost:3000';

export default class TaskManagerAPI {
  static async getAllTasks() {
    // const delay = Math.floor(Math.random() * 2000) + 1000;
    // eslint-disable-next-line no-promise-executor-return
    // await new Promise((resolve) => setTimeout(resolve, delay));
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
      handleError();
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  }

  static async getTask(id) {
    const response = await fetch(`${API_URL}/tasks/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }
    return response.json();
  }

  static async createTask(taskData) {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return response.json();
  }

  static async updateTask(id, taskData) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    return response.json();
  }

  static async deleteTask(id) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    console.log(response);
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
    return true;
  }
}

// Usage example
// async function exampleUsage() {
//   try {
//     // Get all tasks
//     const tasks = await TaskManagerAPI.getAllTasks();
//     console.log('All tasks:', tasks);

//     // Create a new task
//     const newTask = await TaskManagerAPI.createTask({
//       title: 'Learn JSON Server',
//       description: 'Set up and use JSON Server for mock API',
//       status: 'in_progress',
//       created_at: new Date().toISOString(),
//     });
//     console.log('New task created:', newTask);

//     // Update a task
//     const updatedTask = await TaskManagerAPI.updateTask(newTask.id, { status: 'completed' });
//     console.log('Task updated:', updatedTask);

//     // Delete a task
//     await TaskManagerAPI.deleteTask(newTask.id);
//     console.log('Task deleted');

//     // Fetch updated task list
//     const updatedTasks = await TaskManagerAPI.getAllTasks();
//     console.log('Updated task list:', updatedTasks);
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// }
