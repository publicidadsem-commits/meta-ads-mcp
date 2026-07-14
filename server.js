const express = require('express');
const { spawn } = require('child_process');
const app = express();

app.use(require('cors')());
app.use(express.json());

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const mcp = spawn('npx', ['meta-ads-mcp'], {
    env: { ...process.env },
    stdio: ['pipe', 'pipe', 'pipe']
  });

  mcp.stdout.on('data', (data) => {
    res.write(`data: ${data.toString()}\n\n`);
  });

  mcp.stderr.on('data', (data) => {
    console.error('MCP error:', data.toString());
  });

  req.on('close', () => {
    mcp.kill();
  });
});

app.post('/message', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
