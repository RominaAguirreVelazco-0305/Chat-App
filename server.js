const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let messages = [];
let users = [];

// Configura el motor de plantillas EJS
app.set('view engine', 'ejs');

// Sirve archivos estáticos (imágenes, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Renderiza la vista 'index.ejs'
app.get('/', (req, res) => {
   res.render('index'); // Renderiza 'index.ejs' desde la carpeta 'views'
});

io.on('connection', (socket) => {
   console.log('A user connected');

   const userName = `User_${Math.floor(Math.random() * 1000)}`;
   users.push(userName);

   socket.emit('chat history', { messages, userName });

   socket.on('chat message', (msg) => {
      const fullMessage = { user: msg.user, text: msg.text };
      messages.push(fullMessage);
      io.emit('chat message', fullMessage);
   });

   socket.on('disconnect', () => {
      console.log('A user disconnected');
      users = users.filter(user => user !== userName);
   });
});

// Inicia el servidor en el puerto 4001 (puedes cambiar este puerto si es necesario)
server.listen(4010, () => {
   console.log('Server is running on port 4010');
});
