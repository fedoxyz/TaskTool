const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config()

var db = {}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

async function setupDB() {
    try {
        
        db.User = sequelize.define('users', {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            username: {
              type: DataTypes.STRING(100),
              allowNull: false,
            },
            email: {
              type: DataTypes.STRING(255),
              allowNull: false,
            },
            password: {
              type: DataTypes.STRING(255),
              allowNull: false,
            },
          });

        // CREATE MODEL OF tasks TABLE
        db.Task = sequelize.define('tasks', {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            title: {
              type: DataTypes.STRING(255),
              allowNull: false,
            },
            description: {
              type: DataTypes.TEXT,
            },
            status: {
              type: DataTypes.INTEGER,
              allowNull: false,
            },
            due_date: {
              type: DataTypes.DATE,
            },
          });

        db.TaskBoard = sequelize.define('task_boards', {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            name: {
              type: DataTypes.STRING(100),
              allowNull: false,
            },
          });
          
        db.TaskAssignment = sequelize.define('task_assignments', {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            assigned_date: {
              type: DataTypes.DATE,
            },
          });


        await sequelize.sync();
        
        // await db.<ModelName>.create({ <key: "value"> }); // THIS CREATES ENTRIES
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    db,
    setupDB
  };