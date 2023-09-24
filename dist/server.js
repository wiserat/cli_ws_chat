"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var ws_1 = __importDefault(require("ws"));
var sqlite3_1 = __importDefault(require("sqlite3"));
var fs_1 = __importDefault(require("fs"));
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var wss = new ws_1.default.Server({ server: server });
var db = new sqlite3_1.default.Database('chat.db');
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS messages (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    name TEXT\n    )");
    var stmt = db.prepare('INSERT INTO messages (name) VALUES (?)');
    var clients = [];
    wss.on('connection', function (ws) {
        clients.push(ws);
        ws.on('message', function (message) {
            if (message.toString().includes("sync")) {
                db.each('SELECT id, name FROM messages', function (err, row) {
                    if (!err) {
                        ws.send("".concat(row.name));
                    }
                    else {
                        console.log(err);
                    }
                });
            }
            else {
                clients.forEach(function (client) {
                    if (client !== ws && client.readyState === ws_1.default.OPEN) {
                        client.send(message.toString());
                    }
                });
                stmt.run(message.toString());
            }
        });
        ws.on('close', function () {
            clients.splice(clients.indexOf(ws), 1);
        });
    });
    process.on('SIGINT', function () {
        console.log('Shutting down the server...');
        clients.forEach(function (client) {
            if (client.readyState === ws_1.default.OPEN) {
                client.close();
            }
        });
        db.close(function () {
            fs_1.default.unlink('chat.db', function () {
                process.exit(0);
            });
        });
    });
    var port = 3000;
    server.listen(port, function () {
        console.log("Server is listening on port ".concat(port));
    });
});
//# sourceMappingURL=server.js.map