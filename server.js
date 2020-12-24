const WebSocket = require('ws');
const url = require('url');
const HttpsProxyAgent = require('https-proxy-agent');
let ip = [];
let srvr = "wss://proxy.tricksplit.io/6003";
const request = require("request");
const cheerio = require("cheerio");
let ip_addresses = [];
let port_numbers = [];
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


function getProxy() {
    return new Promise((res, rej) => {
        request("https://www.sslproxies.org/", function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                $("td:nth-child(1)").each(function (index, value) {
                    ip_addresses[index] = $(this).text();
                });

                $("td:nth-child(2)").each(function (index, value) {
                    port_numbers[index] = $(this).text();
                });
            }
            else {
                console.log("Error loading proxy, please try again");
            }



            ip_addresses.join(", ");
            port_numbers.join(", ");
            let data = {
                ip: ip_addresses,
                port: port_numbers
            }
            res(data);
        })
    })
}
(async function (){
    let obj = await getProxy();
let ips = obj.ip;
let ports = obj.port;
for(var i = 0; i < 90; i++){
let str = `${ips[i]}:${ports[i]}`;
ip.push(str);
}

})()
//let proxies = ['103.248.248.171:51810', '103.248.248.171:51810', '103.116.203.242:43520', '103.116.203.242:43520'];
let bots = [];
let mouse = 0;
const SEND_254 = new Uint8Array([254, 5, 0, 0, 0]);
const SEND_255 = new Uint8Array([255, 0, 0, 0, 0]);
class Bot{
    constructor(id){
        this.id = id;
        this.ws = null;
        this.prxy = null;
        this.headers = {
            'origin' : 'http://popsplit.me'
        }
    }
    connect(https_pro){     
        this.prxy = https_pro  
        var proxy = https_pro;

        // create an instance of the `HttpsProxyAgent` class with the proxy server information
        var options = url.parse(proxy);
        // console.log(options)
        var agent = new HttpsProxyAgent(options);

        // finally, initiate the WebSocket connection
        this.ws = new WebSocket(srvr, { agent: agent, headers : this.headers})
              
   // this.ws = new WebSocket('ws://na.cellz.io:4600/')
        this.ws.onopen = this.open.bind(this);
        this.ws.onclose = this.close.bind(this);
        this.ws.onerror = e => {};
    }
    open() {
        console.log(`open${this.id}`);
        bots.push(this);
        this.init();
      setInterval(function () {this.sendNick("🖕NebulaMom<3");}.bind(this), 5000);
      setInterval(function () {this.send(mouse);}.bind(this), 60);
    //  this.connect(this.prxy);
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
    split(){
        let ab = new Uint8Array([17]);
        this.send(ab);
    }
    feed(){
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
 
let wss = new WebSocket.Server({port:8080})
wss.on('connection', ws => {
    ws.binaryType = 'arraybuffer';
    console.log('UserScript Connected');
    ws.onmessage = data => {
      //  console.log(data)
      //  let buf = data;
        let packet = new DataView(data.data);
        let opcode = packet.getUint8(0);
        switch(opcode){
            case
            1:
            if(bots.length < 1) {
                for (var i = 0; i < 30; i++) {        
                    
                        let bot = new Bot(i);
                        bot.connect(`http://${ip[i]}`);                                              
                }
            }
            break;
            case
            0:
  
            if(bots.length > 1){
                for(let i = 0; i < bots.length; i++){
                    bots[i].ws.close();
                }
                bots = [];
            }
                break;
            case
                0x10:
              
                mouse = packet;
                break;
                case
                17:
                //console.log("split");
                if(bots.length > 1){
                    for (let i = 0; i < bots.length; i++) {
                        bots[i].split();
                    }
                }
                break;
                case
                21:
                //console.log("feed"); 
                if (bots.length > 1) {
                    for (let i = 0; i < bots.length; i++) {
                        bots[i].feed();
                    }
                } 
                break;
        }
    }
 })

