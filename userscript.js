// ==UserScript==
// @name         Cellz Bots
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://tricksplit.io/*
// @match        *://popsplit.me/*
// @grant        none
// ==/UserScript==
let btn = document.createElement('button');
btn.addEventListener('click', function () {
    connect();
});
btn.id = "cnctBtn";
btn.innerHTML = 'Connect';
btn.style.backgroundColor = '#FF0000';
$('.main')[0].appendChild(btn);
let startBtn = document.createElement('button');
startBtn.addEventListener('click', function () {
    if (this.innerHTML == "Start Bots") {
        bot.start();
    }
    else {
        bot.stop();
    }
});
startBtn.id = "strtBtn";
startBtn.innerHTML = 'Start Bots';
startBtn.style.backgroundColor = '#FF0000';
$('.main')[0].appendChild(startBtn);
WebSocket.prototype._send = WebSocket.prototype.send;
WebSocket.prototype.send = function (data) {
    this._send(data);
    this.send = function (data) {
        this._send(data);
        let dv = new DataView(data.buffer);

        if (dv.getUint8(0) == 0x10 && window.bot) {
            // window.bot.x = dv.getUint32(1, true);
            // window.bot.y = dv.getUint32(9, true);
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
    }
})


