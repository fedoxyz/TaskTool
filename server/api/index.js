const express = require('express');
const app = express();
const cors = require('cors')
const { db } = require('../database')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router()

// socket.io middleware
router.use(function(req, res, next) {
  req.io = app.get("io");
  next();
});

// Error handling middleware
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
}

// Register the error handling middleware
router.use(errorHandler);

// Register the cookieParser
router.use(cookieParser());



// evade issues with headers
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.append('Access-Control-Allow-Credentials')
  next();
});

// enable cors requests
app.use(cors())


// Protected router for API calls

router.use(async (req, res, next) => {
  try {
    console.log('router authorization')
    console.log(req.headers.authorization, 'authorization')
    if (!req.headers.authorization) {
      console.log('no auth headers')
    return res.status(403).json({ error: 'No credentials sent!' });
    }
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.decodedToken = decodedToken;
    next();
  
  } catch (error) {
    console.log('we catch here')
    next(error);
  }
})

app.use(express.json())
// GET METHOD API URL | RETRIEVE ITEMS
app.get('/api/users', async (req, res, next) => {
  try {
    
    const user = await db.User.findAll();
    res.json(user);
    req.io.emit('test', message);
  } catch (error) {
    next(error);
  }
});

// post method to verify JWT token on vue router
app.post('/api/verify', async (req, res, next) => {
  try {
    console.log(req.headers, 'verify headers')
    const token = req.headers.authorization.split(' ')[1];
    console.log(token, 'token for vertification')
    jwt.verify(token, process.env.JWT_KEY);
    res.status(200).json();
  } catch (error) {
    console.log('TOKEN')
    next(error);
  }
});

// POST METHOD API URL | CREATE ITEM
app.post('/api/users', async (req, res, next) => {
  try {
    const user = await db.User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});


// GET METHOD API URL | RETRIEVE ITEMS
app.get('/api/taskboards', router, async (req, res, next) => {
  try {
    console.log(req.decodedToken.id, 'id id id ')
    const taskboards = await db.TaskBoard.findAll();
    res.json( {taskboards, userId: req.decodedToken.id });
  } catch (error) {
    next(error);
  }
});

// POST METHOD API URL | CREATE ITEM
app.post('/api/taskboards', router, async (req, res, next) => {
  try {
    console.log(req.decodedToken)
    const creatorId = req.decodedToken['id'] 
    
    const name = req.body.name
    console.log(name, creatorId, 'taskboard creation')
    const taskboard = await db.TaskBoard.create({name, creatorId});
    req.io.emit('taskboard-added', taskboard);
    res.json(taskboard);
  } catch (error) {
    next(error);
  }
});



// DELETE METHOD API URL | DELETE ITEM
app.delete('/api/taskboards/:id', router, async (req, res, next) => {
  console.log('we here')
  try {
    const taskboard = await db.TaskBoard.findOne({ where: { id: req.params.id } });
    if (req.decodedToken.id === taskboard.creatorId) {
      await db.TaskBoard.destroy({ where: { id: req.params.id } });
      req.io.emit('taskboard-removed', req.params.id);
      res.sendStatus(204);
    } else {
      console.log('error occured when deleting taskboard ')
      next(error)
    }
  } catch (error) {
    next(error);
  }
});


// SIGN UP
app.post('/api/sign-up', async (req, res, next) => {
  try {
    const user = await db.User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// SIGN IN
app.post('/api/sign-in', async (req, res, next) => {
  try {
    console.log('signing in on server side')
    const { email, password } = req.body;
    const user = await db.User.findOne({
      where: {
        email: email
      }
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
    } 

  const isMatch = bcrypt.compareSync(password, user.password);
  if (isMatch) {
    const token = jwt.sign({ id: user.id ,email: user.email, password: user.password }, process.env.JWT_KEY);
    res.set('Authorization', `Bearer ${token}`);
    res.set("Access-Control-Expose-Headers","Authorization"); // for cors
      res.json({ user });
      
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
      
  } catch (error) {
    next(error);
  }
});

app.post('/api/get-tasks', router, async (req, res, next) => {
  try {
    console.log(req.body, 'req_body')
    console.log(req.body.taskboardId, 'tasboard ID')
    const tasks = await db.Task.findAll({where: {
      taskboard_id: req.body.taskboardId
    }});
    console.log(tasks, 'tasks found')
    const taskboard = await db.TaskBoard.findOne({where:
    {
      id: req.body.taskboardId
    }})
    console.log(taskboard, 'taskboard found')
    res.json( {tasks, userId: req.decodedToken.id, taskboardName: taskboard.name });
  } catch (error) {
    next(error);
  }
});

app.post('/api/tasks', router, async (req, res, next) => {
  try {
    console.log(req.decodedToken)
    const creatorId = req.decodedToken['id'] 
    console.log(req.body, 'req body on tasks')
    var assigneeId = null;

    if (req.body.assigneeName) {
    try {
      console.log(req.body.assigneeName)
      const assigneeUser = await db.User.findOne({where: {username: req.body.assigneeName}})
      assigneeId = assigneeUser.id;
      
    } catch {
      throw Error('UserNotFound')
    }
  }
    console.log('if user not found dont go here')
    const task = await db.Task.create({taskboard_id: req.body.taskboard_id, title: req.body.title, description: req.body.description, due_date: req.body.due_date.value, assignee_id: assigneeId, creator_id: creatorId });
    console.log(assigneeId, 'assignee id')
    if (assigneeId) {
      await db.TaskAssignment.create({task_id: task.id, assignee_id: assigneeId, assigned_date: task.createdAt})
    }
    req.io.emit('task-added', task);
    res.json(task);
  } catch (error) {
    console.log(error.message, 'message')
      if (error.message === 'UserNotFound') {
        console.log('wwe hererer')
        res.status(401).json(error.message)
      } else {
        res.status(500).json(error)
        next(error);
      }
  }
});

app.put('/api/tasks', router, async (req, res, next) => {
  try {
    const task = await db.Task.findOne({where: {
      id: req.body.taskId
    }})
    const taskUpdated = await task.update({status: req.body.status});
    console.log(req.io)
    req.io.emit('task-updated', taskUpdated);
    res.json(taskUpdated);
  } catch (error) {
    next(error);
  }
});



app.get('/api/overview', router, async (req, res, next) => {
  try {
    const userId = req.decodedToken['id'] 
    const taskboardsCreated = await db.TaskBoard.findAll({where: {creatorId: userId}})
    const tasksCreated = await db.Task.findAll({where: {creator_id: userId}})
    const tasksAssigned = await db.TaskAssignment.findAll({where: {assignee_id: userId}})
    res.json({taskboardsCreated, tasksCreated, tasksAssigned});
  }catch (error) {
    console.log(error.message, 'nmessage')
    res.status(401).json(error.message)
    next()
  }
})




module.exports = app;