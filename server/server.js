
const { Server } = require('socket.io');

const http = require('http');

require('dotenv').config()

const port = process.env.PORT

const { setupDB } = require('./database');

  
// CREATE APIs URL ENDPOINTS TO CREATE AND DELETE TO DO ITEMS
async function startServer() {
    try {
        const db = await setupDB()

        const express = require('express')

        const app = express()

        const httpServer = http.createServer(app);

        const io = new Server(httpServer, {
            cors: {
              origin: `http://localhost:${port}`,
              allowedHeaders: ["my-custom-header"],
              credentials: true
            }
          });

        
          io.on('connection', socket => {
            console.log("Client connected");
          
            socket.on("disconnect", (reason) => {
              console.log(reason, 'client disconnected')
            });
          
          
            // Add this listener for the "test" event
            socket.on("test", message => {
              console.log("Test event received on server-side");
              console.log("Received message:", message);
          
              // Emit a "test-event" event back to the client
              io.emit('test-event', message);
            });
          
          });
        


        app.use(express.json())
        app.get('/', (req, res) => {
            res.send('hello world')
        })



        // GET METHOD API URL | RETRIEVE ITEMS
        app.get('/api/tasks', (req, res) => {
            // return all taskls
            db.Task.findAll().then(tasks => {
                res.json(tasks)
            })
        })
        // POST METHOD API URL | CREATE ITEM
        app.post('/api/tasks', (req, res) => {
            // create a task
            db.Task.create(req.body).then( t => {
                res.json(t)
            }) 
        })



        // DELETE METHOD API URL | DELETE ITEM
        app.delete('/api/tasks/:id', (req, res) => {
            // delete a task
            db.Task.destroy({
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.sendStatus(204);
            }).catch((error) => {
                console.error(error);
                res.sendStatus(500); // Internal Server Error
            });
        });


        httpServer.listen(port, () => {
            console.log(`App listening on port ${port}`) 
        })
    } catch (error) {
        console.error(error);
    }
}
startServer()