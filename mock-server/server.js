import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 4000 });
console.log('Mock WebSocket server running on ws://localhost:4000');

const rooms = ['Lobby', 'Kitchen', 'Storage'];

function generateSensorData() {
  return rooms.map(room => ({
    room,
    temperature: (20 + Math.random() * 10).toFixed(1),
    humidity: (40 + Math.random() * 20).toFixed(1),
    leakDetected: Math.random() < 0.05,
    timestamp: new Date().toISOString()
  }));
}

setInterval(() => {
  const data = JSON.stringify(generateSensorData());
  wss.clients.forEach(client => client.send(data));
}, 2000);
