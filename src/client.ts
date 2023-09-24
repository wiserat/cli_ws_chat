import WebSocket from 'ws';
import * as readline from 'readline';
import color from 'colorts';

const ws = new WebSocket('ws://localhost:3000');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('User: ', (user:string) => {

    ws.on('open', () => {
        rl.prompt()
    });

    ws.on('message', (data) => {
        const message:string = data.toString();
        if (message.includes('left us. :-(')) {
            console.log(color(message).red.toString());
        } else {
            console.log(color(message).blue.toString());
        }
        rl.prompt();
    });

    rl.on('line', (input:string) => {
        if (input !== '') {
            const message: string = `${user}: ${input}`;
            ws.send(message);
        }
        rl.prompt();
    });

    rl.on('close', () => {
        ws.send(`${user} left us. :-(`)
        ws.close();
    });
});