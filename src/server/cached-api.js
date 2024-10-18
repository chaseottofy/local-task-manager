import TaskManagerAPI from './api';

class CachedTaskManagerAPI {
  constructor(useCache = true) {
    this.useCache = useCache;
    this.cache = new Map();
    this.lastFetchTime = null;
    this.cacheDuration = 10 * 60 * 1000;
    // this.cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  async getAllTasks() {
    if (this.useCache && this.isCacheValid()) {
      return [...this.cache.values()];
    }
    const tasks = await TaskManagerAPI.getAllTasks();
    this.updateCache(tasks);
    return tasks;
  }

  async getTask(id) {
    if (this.useCache && this.cache.has(id)) {
      console.log(`Returning cached data for task ${id}`);
      return this.cache.get(id);
    }
    const task = await TaskManagerAPI.getTask(id);
    if (this.useCache) {
      this.cache.set(id, task);
    }
    return task;
  }

  async createTask(taskData) {
    const newTask = await TaskManagerAPI.createTask(taskData);
    if (this.useCache) {
      this.cache.set(newTask.id, newTask);
      this.lastFetchTime = null; // Invalidate the cache for getAllTasks
    }
    return newTask;
  }

  async updateTask(id, taskData) {
    const updatedTask = await TaskManagerAPI.updateTask(id, taskData);
    if (this.useCache) {
      this.cache.set(id, updatedTask);
      this.lastFetchTime = null; // Invalidate the cache for getAllTasks
    }
    return updatedTask;
  }

  async deleteTask(id) {
    const result = await TaskManagerAPI.deleteTask(id);
    if (this.useCache) {
      this.cache.delete(id);
      this.lastFetchTime = null; // Invalidate the cache for getAllTasks
    }
    return result;
  }

  isCacheValid() {
    return this.lastFetchTime && (Date.now() - this.lastFetchTime < this.cacheDuration);
  }

  updateCache(tasks) {
    this.cache.clear();
    for (const task of tasks) {
      this.cache.set(task.id, task);
    }
    this.lastFetchTime = Date.now();
  }

  clearCache() {
    this.cache.clear();
    this.lastFetchTime = null;
  }

  setCacheUsage(useCache) {
    this.useCache = useCache;
    if (!useCache) {
      this.clearCache();
    }
  }

  setCacheDuration(durationInMs) {
    this.cacheDuration = durationInMs;
  }
}

const apiManager = new CachedTaskManagerAPI(true);
export default apiManager;
