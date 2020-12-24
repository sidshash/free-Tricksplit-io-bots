// ==UserScript==
// @name         Cellz Bots
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fuck nebula
// @author       sidshash
// @match        *://tricksplit.io/*
// @grant        none
// ==/UserScript==

let srvr = ""

WebSocket.prototype._send = WebSocket.prototype.send;
WebSocket.prototype.send = function (data) {
    this._send(data);
    this.send = function (data) {
        this._send(data);
        srvr = this.url;
        let dv = new DataView(data.buffer);

        if (dv.getUint8(0) == 0x10 && window.bot) {
            window.bot.packet = dv;
        }
    };
};



window.bot = {
    packet: 0,
    start: () => {
        let dv = new DataView(new ArrayBuffer(1));
        dv.setUint8(0, 1);
        botWS.send(dv);
        setInterval(() => { botWS.send(bot.packet) }, 1);
    },
    stop: () => {
        let dv = new DataView(new ArrayBuffer(1));
        dv.setUint8(0, 0);
        botWS.send(dv);
    },
    split: () => {
        let dv = new DataView(new ArrayBuffer(1));
        dv.setUint8(0, 17);
        botWS.send(dv);
    },
    feed: () => {
        let dv = new DataView(new ArrayBuffer(1));
        dv.setUint8(0, 21);
        botWS.send(dv);
    },
    sendServer : () => {
        let dv = new DataView(new ArrayBuffer(2 + srvr.length));
        let offset = 2;
        dv.setUint8(0, 5);
        dv.setUint8(1, srvr.length);
        for(let i = 0; i < srvr.length; i++){
            dv.setUint8(offset, srvr.charCodeAt(i));
            offset++
        }
        botWS.send(dv)
    }
}
function connect() {
    window.botWS = new WebSocket('ws://localhost:8080');
    botWS.onopen = () => {
        console.log('botserver open');
        bot.sendServer();

    }
    botWS.onclose = () => {
        console.log('botserver close');
    }
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case
            'e':
            bot.split();
            break;
        case
            'r':
            bot.feed();
            break;
            case
            'c':
            connect();
            break;
            case
            'p':
            bot.start();
            break;
            case
            's':
            bot.stop();
    }
})



