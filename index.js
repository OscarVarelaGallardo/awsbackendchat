import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import logger from 'morgan'
import { Server } from 'socket.io';


const app = express();

const PORT = process.env.PORT || 3000;

const server = createServer(app);

const corsOptions = {
    //permitir todos los origenes
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    optionsSuccessStatus: 200
};
const io = new Server(server, {
    cors: corsOptions
});

app.use(logger('dev'));

app.use(cors(corsOptions));
io.on('connection', (socket) => {
    console.log('Socket conectado: ' + socket.id);

    socket.on('message', (msg) => {
        console.log('Mensaje recibido: ' + msg);
        console.log('Enviando mensaje a todos los sockets:' + socket.id);
        msg={
            msg: msg,
            socketId: socket.id
        }
        io.emit('message', msg );
        saveMessage(msg);
    });
    socket.on('disconnect', () => {
        console.log('Socket desconectado: ' + socket.id);
    });
});

app.get('/socket/testing', (req, res) => {
    res.json({ message: 'Testing socket' });
});

app.get('/', (req, res) => {
    res.json({ message: 'Servidor de sockets' });
});
const saveMessage = (msg) => {
    console.log('Guardando mensaje: ' + msg);
};  
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
