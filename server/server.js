
require('dotenv').config()

const port = process.env.PORT


async function startServer() {
    try {
        await require('./database').setupDB()

        const app = require('./api')

        const httpServer = require('http').createServer(app);

        const io = require('./api/socketServer').setupSocketServer(httpServer);

        app.set("io", io);

        httpServer.listen(port, () => {
            console.log(`App listening on port ${port}`) 
        })
    } catch (error) {
        console.error(error);
    }
}
startServer()