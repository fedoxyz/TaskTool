import fs from 'node:fs/promises';
import { syncDatabase } from './src/database/index.js';
import { app } from './api.js'

import { Server } from "socket.io";
import { createServer } from 'http';

const httpServer = createServer(app);

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined


// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true,},
    appType: 'custom',
    base
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

const io = new Server(httpServer, {
  cors: {
    origin: isProduction ? undefined : `http://localhost:${port}`,
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

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.js')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const { stream } = render(url, ssrManifest)

    const [htmlStart, htmlEnd] = template.split('<!--app-html-->')

    res.status(200).set({ 'Content-Type': 'text/html' })

    res.write(htmlStart)
    for await (const chunk of stream) {
      if (res.closed) break
      res.write(chunk)
    }
    res.write(htmlEnd)
    res.end()
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})


syncDatabase()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error starting the server:', error);
  });


