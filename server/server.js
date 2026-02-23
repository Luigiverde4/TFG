// Servidor para XC25
// Conexiones
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");


// Inicializar servidor y app
const PORT = 80;
const MEDIAMTX_API_HOST = process.env.MEDIAMTX_HOST || "localhost";
const MEDIAMTX_API_PORT = 9997;
const app = express();

// Servir archivos estáticos desde la carpeta public
app.use(express.static("public"));

// Proxy para API de MediaMTX (evita problemas de CORS y autenticación)
app.get("/api/mediamtx/*", (req, res) => {
  const path = req.params[0]; // Captura todo después de /api/mediamtx/
  
  const options = {
    hostname: MEDIAMTX_API_HOST,
    port: MEDIAMTX_API_PORT,
    path: `/${path}`,
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  };
  
  const proxyReq = http.request(options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', chunk => data += chunk);
    proxyRes.on('end', () => {
      try {
        res.json(JSON.parse(data));
      } catch (e) {
        res.status(500).json({ error: 'Error parsing response' });
      }
    });
  });
  
  proxyReq.on('error', (error) => {
    console.error("Error proxy MediaMTX:", error.message);
    res.status(500).json({ error: error.message });
  });
  
  proxyReq.end();
});

const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Servidor HTTP
httpServer.listen(PORT, () => {
  console.log("Servidor disponible la siguiente dirección:");
  console.log(`http://localhost:${PORT}/`);
});

// Para cerrar el docker en 0.3s en vez de 10.3
process.on("SIGTERM", () => {
  io.close(() => {
    console.log("HANGING UP...");
  });
  httpServer.close(() => {
    console.log("CLOSING...");
  });
})