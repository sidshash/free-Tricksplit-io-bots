process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';const WebSocket = require('ws');
const url = require('url');
const HttpsProxyAgent = require('https-proxy-agent');
let srvr = "wss://proxy.cellz.io/4400";
let bots = [];
let mouse = 0;
const SEND_254 = new Uint8Array([254, 5, 0, 0, 0]);
const SEND_255 = new Uint8Array([255, 0, 0, 0, 0]);
class Bot {
    constructor(id) {
        this.id = id;
        this.ws = null;
    }
    connect(https_pro) {
        var proxy = https_pro;

        // create an instance of the `HttpsProxyAgent` class with the proxy server information
        var options = url.parse(proxy);
        // console.log(options)
        var agent = new HttpsProxyAgent(options);

        // finally, initiate the WebSocket connection
        this.ws = new WebSocket(srvr, {
            agent: agent,
            headers: {
                "Origin": "http://popsplit.me"
            }
        });
        // this.ws = new WebSocket('ws://na.cellz.io:4600/')
        this.ws.onopen = this.open.bind(this);
        this.ws.onclose = this.close.bind(this);
        this.ws.onerror = e => { };
    }
    open() {
        console.log(`open${this.id}`);
        bots.push(this);
        this.init();
        setInterval(function () { this.sendNick("Bot test"); }.bind(this), 500);
        setInterval(function () { this.send(mouse); }.bind(this), 40);
        //  setInterval(function () {this.sendChat("Discord : Orochi#1551 for [paid] BOTS")}.bind(this), 5000);
        // setInterval(function(){this.sendChat("I am Groot"); console.log("chat")}.bind(this), 500)
    }
    sendChat(text) {
        var view = new DataView(new ArrayBuffer(2 + 2 * text.length));
        var offset = 0;
        view.setUint8(offset++, 99);
        view.setUint8(offset++, 0); // flags (0 for now)
        for (var i = 0; i < text.length; ++i) {
            view.setUint16(offset, text.charCodeAt(i), true);
            offset += 2;
        }
        this.send(view);
        //console.log('chat');
    }
    close() {
        console.log(`close${this.id}`);
    }
    split() {
        let ab = new Uint8Array([17]);
        this.send(ab);
    }
    feed() {
        let ab = new Uint8Array([21]);
        this.send(ab);
    }
    send(data) {
        if (!this.ws) return;
        if (this.ws.readyState !== 1) return;
        if (data.build) this.ws.send(data.build());
        else this.ws.send(data);
    }
    init() {
        this.send(SEND_254);
        this.send(SEND_255);
        console.log('init');
    }
    sendNick(name) {
        const nick = JSON.stringify({
            name: name || 'Groot',
            skin: '',
            skin2: ''
        });
        const packet = new DataView(new ArrayBuffer(1 + nick.length * 2));
        let offset = 0;
        packet.setUint8(0, 0);
        for (let i = 0; i < nick.length; i++) {
            packet.setUint16(1 + 2 * i, nick.charCodeAt(i), true);
        }
        this.send(packet);
        //  console.log('spawn')
    }
}

let bot = new Bot(1);
bot.connect('http://113.160.206.37:55095');