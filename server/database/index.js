const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
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
              unique: true,
            },
            username: {
              type: DataTypes.STRING(100),
              allowNull: false,
              unique: true,
            },
            email: {
              type: DataTypes.STRING(255),
              allowNull: false,
              unique: true,
            },
            password: {
              type: DataTypes.STRING(255),
              allowNull: false,
            },
          });
1
        db.User.beforeCreate(async (user) => {
            const salt = await bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(user.password, salt);
          }); 

        // CREATE MODEL OF tasks TABLE
        db.Task = sequelize.define('tasks', {
        
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            taskboard_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
            },
            title: {
              type: DataTypes.STRING(255),
              allowNull: false,
              validate: {
                notEmpty: false,
              }
            },
            description: {
              type: DataTypes.TEXT,
              allowNull: false,
              validate: {
                notEmpty: false,
              }
            },
            status: {
              type: DataTypes.INTEGER,
              allowNull: true,
            },
            due_date: {
              type: DataTypes.DATE, 
              allowNull: false,
              validate: {
                notEmpty: false,
              }
            },
            assignee_id: {
              type: DataTypes.INTEGER,
              allowNull: true,
            },
            creator_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
            },
          });

          db.Task.beforeCreate(async (task) => {
  
            task.status = 0;
            if (!task.assignee_id) {
              task.assignee_id = 0
            }
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
              validate: {
                notEmpty: false,
              }
            },
            creatorId: {
              type: DataTypes.INTEGER,
              allowNull: false,
            },
          });
          
        db.TaskAssignment = sequelize.define('task_assignments', {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            task_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
            },
            assignee_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
            },
            assigned_date: {
              type: DataTypes.DATE,
              allowNull: false
            },
          });


      
        await sequelize.sync({force: false});
        
        // await db.<ModelName>.create({ <key: "value"> }); // THIS CREATES ENTRIES
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    db,
    setupDB
  };