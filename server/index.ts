// Minimal Express server for OpenClaw Gateway (runs alongside Vite)
import express from 'express';
import cors from 'cors';
import { getGatewayStatus, sendSMS, checkOpenClawInstalled } from './openclaw.js';

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json());

// GET /status - Gateway status for widget badge
app.get('/status', async (_req, res) => {
  const status = await getGatewayStatus();
  res.json(status);
});

// POST /sms - Send SMS summary after voice call
app.post('/sms', async (req, res) => {
  const { phone, message } = req.body;
  
  if (!phone || !message) {
    return res.status(400).json({ error: 'phone and message required' });
  }
  
  const success = await sendSMS(phone, message);
  res.json({ success });
});

// GET /health - Check if OpenClaw is installed
app.get('/health', async (_req, res) => {
  const openclawInstalled = await checkOpenClawInstalled();
  const gatewayStatus = await getGatewayStatus();
  
  res.json({
    server: 'ok',
    openclaw: openclawInstalled ? 'installed' : 'not found',
    gateway: gatewayStatus.connected ? 'connected' : 'disconnected',
    sessions: gatewayStatus.activeSessions
  });
});

app.listen(PORT, () => {
  console.log(`🔌 OpenClaw API server running on http://localhost:${PORT}`);
  console.log(`   GET  /status  - Gateway status`);
  console.log(`   POST /sms     - Send SMS`);
  console.log(`   GET  /health  - Health check`);
});
