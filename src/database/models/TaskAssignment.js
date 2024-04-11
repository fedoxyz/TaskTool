import Sequelize from 'sequelize';
import sequelize from '../config/database.js';
import Task from './Task.js';
import User from './User.js';

const TaskAssignment = sequelize.define('task_assignments', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  assigned_date: {
    type: Sequelize.DATE,
  },
});

TaskAssignment.belongsTo(Task, { foreignKey: 'task_id' });
TaskAssignment.belongsTo(User, { foreignKey: 'assignee_id' });

export default TaskAssignment;