import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import app from './app'; 

const PORT = 3000;

const server = createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected');
  ws.on('close', () => console.log('WebSocket client disconnected'));
});

export { wss };

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});