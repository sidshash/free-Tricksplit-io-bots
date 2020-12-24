// ==UserScript==
// @name         Cellz Bots
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fuck nebula
// @author       sidshash
// @match        *://tricksplit.io/*
// @match        *://popsplit.me/*
// @match        *://popsplit.us/*
// @match        *://fanix.io/*
// @grant        none
// ==/UserScript==

WebSocket.prototype._send = WebSocket.prototype.send;
WebSocket.prototype.send = function (data) {
    this._send(data);
    this.send = function (data) {
        this._send(data);
        let dv = new DataView(data.buffer);

        if (dv.getUint8(0) == 0x10 && window.bot) {
            window.bot.packet = dv;
        }
    };
};
window.bot = {
    packet: 0,
    start: () => {
        $('#strtBtn').css("background-color", "#00FF00");
        $('#strtBtn').html("Stop Bots");
        let dv = new DataView(new ArrayBuffer(1));
        dv.setUint8(0, 1);
        botWS.send(dv);
        setInterval(() => { botWS.send(bot.packet) }, 1);
    },
    stop: () => {
        $('#strtBtn').css("background-color", "#FF0000");
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
    }
}
function connect() {
    window.botWS = new WebSocket('ws://localhost:8080');
    botWS.onopen = () => {
        $('#cnctBtn').css("background-color", "#00FF00");
        console.log('botserver open');

    }
    botWS.onclose = () => {
        $('#cnctBtn').css("background-color", "#FF0000");
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



