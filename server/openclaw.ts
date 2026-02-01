// OpenClaw Gateway - WS proxy + SMS CLI (€0 cost)
// Uses local OpenClaw CLI for SMS, WebSocket for status

const OPENCLAW_WS = process.env.OPENCLAW_WS || 'ws://localhost:18789';

interface GatewayStatus {
  activeSessions: number;
  uptime: number;
  connected: boolean;
}

export async function getGatewayStatus(): Promise<GatewayStatus> {
  // In browser-less Node environment, use ws package or mock
  // For now, return mock status if OpenClaw not running
  try {
    const WebSocket = (await import('ws')).default;
    const ws = new WebSocket(OPENCLAW_WS);
    
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        ws.close();
        resolve({ activeSessions: 0, uptime: 0, connected: false });
      }, 3000);

      ws.onopen = () => {
        ws.send(JSON.stringify({ method: 'status' }));
      };

      ws.onmessage = (event) => {
        clearTimeout(timeout);
        try {
          const data = JSON.parse(event.data.toString());
          resolve({
            activeSessions: data.activeSessions || 0,
            uptime: data.uptime || 0,
            connected: true
          });
        } catch {
          resolve({ activeSessions: 0, uptime: 0, connected: true });
        }
        ws.close();
      };

      ws.onerror = () => {
        clearTimeout(timeout);
        resolve({ activeSessions: 0, uptime: 0, connected: false });
      };
    });
  } catch {
    // WebSocket not available or OpenClaw not running
    return { activeSessions: 0, uptime: 0, connected: false };
  }
}

export async function sendSMS(phone: string, message: string): Promise<boolean> {
  if (!phone || !message) return false;
  
  try {
    const { execSync } = await import('child_process');
    const sanitizedPhone = phone.trim().replace(/[^+\d]/g, '');
    const sanitizedMessage = message.replace(/"/g, '\\"').slice(0, 160);
    
    execSync(
      `openclaw message send --to "${sanitizedPhone}" --message "${sanitizedMessage}"`,
      { stdio: 'ignore', timeout: 10000 }
    );
    return true;
  } catch (error) {
    console.error('SMS send failed:', error);
    return false;
  }
}

export async function checkOpenClawInstalled(): Promise<boolean> {
  try {
    const { execSync } = await import('child_process');
    execSync('which openclaw', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}
