const express = require('express');
const app = express();
const cors = require('cors')
const { db } = require('../database')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router()

// Error handling middleware
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
}

// Register the error handling middleware
router.use(errorHandler);

// Register the cookieParser
router.use(cookieParser());

// socket.io middleware
router.use(function(req, res, next) {
    req.io = app.get("io");
    next();
});

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.append('Access-Control-Allow-Credentials')
  next();
});



// enable cors requests
app.use(cors())


router.use(async (req, res, next) => {
  try {
    console.log('router authorization')
    console.log(req.headers.authorization, 'authorization')
    if (!req.headers.authorization) {
      console.log('no auth headers')
    return res.status(403).json({ error: 'No credentials sent!' });
    }
    next();
    // const token = req.headers.authorization.split(' ')[1];
    // const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    // console.log(decodedToken)
    // if (decodedToken) {
    //   res.status(200).json()
    // } else {
    //   res.status(401).json({ message: 'Unauthorized' });
    // }
  } catch (error) {
    next(error);
  }
})

// middleware for handling jwt verification
// router.use(async (req, res, next) => {
//   if (!req.headers.authorization) {

//     console.log('rejecte123123d', req.method, req.url)
//     return res.status(403).json({ error: 'No credentials sent!' });
//   }
//   next();
// });

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



// post method to verify JWT token
app.post('/api/verify', async (req, res, next) => {
  try {
    console.log(req.headers, 'verify headers')
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    console.log(decodedToken)
    if (decodedToken) {
      res.status(200).json()
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
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

// PUT METHOD API URL | UPDATE ITEM
app.put('/api/users', async (req, res, next) => {
  try {
    const user = await db.User.update(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// GET METHOD API URL | RETRIEVE ITEMS
app.get('/api/tasks', router, async (req, res, next) => {
  try {
    const tasks = await db.Task.findAll();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// POST METHOD API URL | CREATE ITEM
app.post('/api/tasks', router, async (req, res, next) => {
  try {
    const task = await db.Task.create(req.body);
    req.io.emit('task-added', task);
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// PUT METHOD API URL | UPDATE ITEM
app.put('/api/tasks', router, async (req, res, next) => {
  try {
    const task = await db.Task.update(req.body);
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// DELETE METHOD API URL | DELETE ITEM
app.delete('/api/tasks/:id', router, async (req, res, next) => {
  console.log('we here')
  try {
    await db.Task.destroy({
      where: {
        id: req.params.id
      }
    });
    req.io.emit('task-removed', req.params.id);
    res.sendStatus(204);
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
    const token = jwt.sign({ email: user.email, password: user.password }, process.env.JWT_KEY);
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




module.exports = app;