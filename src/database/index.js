
import sequelize from './config/database.js';
import User from './models/User.js';
import TaskBoard from './models/TaskBoard.js';
import Task from './models/Task.js';
import TaskAssignment from './models/TaskAssignment.js';

const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('Database synced');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

export { sequelize, User, TaskBoard, Task, TaskAssignment, syncDatabase };