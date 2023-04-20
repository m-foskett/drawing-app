const express = require('express');
const http = require('http');

import {Server} from 'socket.io'
import { DrawLine } from './types/types'
// Create the Express server setup with socket.io communication
const app = express();
const server = http.createServer(app);
const PORT: number = parseInt(process.env.PORT || '3001', 10);
// Create new http server instance
const io = new Server(
    server,
    {
        cors: {
            origin: '*', //change this to hosted domain
        },
    }
);

// Whenever a client connects to web server
io.on('connection', (socket) => {
    console.log('connection');
    // Listen to 'client-ready' event from sender
    socket.on('client-ready', () => {
        // Emit to all instances that the server wants to collect current canvas state
        socket.broadcast.emit('get-canvas-state')
    })
    // Listen to the 'canvas-state' event from sender
    socket.on('canvas-state', (state) => {
        // Emit to newly connected client instance only
        socket.broadcast.emit('canvas-state-from-server', state);
    })
    // Listen to 'draw-line' event from sender
    socket.on('draw-line', ({prevPoint, currentPoint, colour}: DrawLine) => {
        // Emit to all instances other than the sender
        socket.broadcast.emit('draw-line', {prevPoint, currentPoint, colour})
    })
    // Listen to 'clear' event from sender and emit to all instances including sender
    socket.on('clear', () => io.emit('clear'));
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})