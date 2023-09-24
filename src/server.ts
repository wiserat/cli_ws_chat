import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import sqlite3 from "sqlite3";
import fs from 'fs';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const db = new sqlite3.Database('chat.db');
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
    )`);
    const stmt = db.prepare('INSERT INTO messages (name) VALUES (?)');


    const clients: WebSocket[] = [];

    wss.on('connection', (ws) => {
        clients.push(ws);

        ws.on('message', (message) => {
            if (message.toString().includes("sync")) {
                db.each('SELECT id, name FROM messages', (err, row: any) => {
                    if (!err) {
                        ws.send(`${row.name}`);
                    } else {
                        console.log(err)
                    }
                });
            } else {
                clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(message.toString());
                    }
                });
                stmt.run(message.toString());
            }
        });

        ws.on('close', () => {
            clients.splice(clients.indexOf(ws), 1);
        });
    });

    process.on('SIGINT', () => {
        console.log('Shutting down the server...')
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.close();
            }
        });
        db.close(() => {
            fs.unlink('chat.db', () => {
                process.exit(0);
            })
        })
    });

    const port = 3000;
    server.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
});

