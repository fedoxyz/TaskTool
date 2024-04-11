import Sequelize from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const TaskBoard = sequelize.define('task_boards', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
});

TaskBoard.belongsTo(User, { foreignKey: 'creator_id' });

export default TaskBoard;