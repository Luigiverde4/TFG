// Servidor para XC25
// Conexiones
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");


// Inicializar servidor y app
const PORT = 80;
const app = express();

// Servir archivos estáticos desde la carpeta public
app.use(express.static("public"));

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