"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var readline = __importStar(require("readline"));
var colorts_1 = __importDefault(require("colorts"));
var ws = new ws_1.default('ws://localhost:3000');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.question('User: ', function (user) {
    ws.on('open', function () {
        rl.prompt();
    });
    ws.on('message', function (data) {
        var message = data.toString();
        if (message.includes('left us. :-(')) {
            console.log((0, colorts_1.default)(message).red.toString());
        }
        else {
            console.log((0, colorts_1.default)(message).blue.toString());
        }
        rl.prompt();
    });
    rl.on('line', function (input) {
        if (input !== '') {
            var message = "".concat(user, ": ").concat(input);
            ws.send(message);
        }
        rl.prompt();
    });
    rl.on('close', function () {
        ws.send("".concat(user, " left us. :-("));
        ws.close();
    });
});
//# sourceMappingURL=client.js.map