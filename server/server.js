
require('dotenv').config()

const port = process.env.PORT


async function startServer() {
    try {
        const db = await require('./database').setupDB()

        const app = require('./api')

        const httpServer = require('http').createServer(app);

        const io = require('./api/socketServer').setupSocketServer(httpServer, port);

        httpServer.listen(port, () => {
            console.log(`App listening on port ${port}`) 
        })
    } catch (error) {
        console.error(error);
    }
}
startServer()