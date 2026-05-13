import express from 'express';
import proxy from 'express-http-proxy';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Gateway Routes - Proxying to internal services
  app.use('/api/users', proxy('http://localhost:5001', {
    proxyReqPathResolver: (req) => '/users' + req.url
  }));
  app.use('/api/tasks', proxy('http://localhost:5002', {
    proxyReqPathResolver: (req) => '/tasks' + req.url
  }));
  app.use('/api/projects', proxy('http://localhost:5003', {
    proxyReqPathResolver: (req) => '/projects' + req.url
  }));
  app.use('/api/notifications', proxy('http://localhost:5004', {
    proxyReqPathResolver: (req) => '/notifications' + req.url
  }));

  // Dedicated routes for the JSON requested by user
  app.get('/users', proxy('http://localhost:5001', { proxyReqPathResolver: () => '/users' }));
  app.get('/tasks', proxy('http://localhost:5002', { proxyReqPathResolver: () => '/tasks' }));
  app.get('/projects', proxy('http://localhost:5003', { proxyReqPathResolver: () => '/projects' }));
  app.get('/notifications', proxy('http://localhost:5004', { proxyReqPathResolver: () => '/notifications' }));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API Gateway & Frontend running on http://localhost:${PORT}`);
  });
}

startServer();
