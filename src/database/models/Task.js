import Sequelize from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Task = sequelize.define('tasks', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  due_date: {
    type: Sequelize.DATE,
  },
});

Task.belongsTo(User, { as: 'Creator', foreignKey: 'creator_id' });
Task.belongsTo(User, { as: 'Assignee', foreignKey: 'assignee_id' });

export default Task;