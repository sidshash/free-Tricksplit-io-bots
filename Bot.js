const WebSocket = require('ws');


const SEND_254 = new Uint8Array([254, 5, 0, 0, 0]);
const SEND_255 = new Uint8Array([255, 0, 0, 0, 0]);


module.exports = class {
    constructor(id){
        this.id = id;
        this.ws = null;
        this.headers = {
            'origin' : 'http://popsplit.me'
        }
    }
    connect(ip){
        this.ws = new WebSocket(ip, {headers : this.headers});
        this.ws.onopen = this.open.bind(this);
        this.ws.onclose = this.close.bind(this);
    }
    send(data) {
        if (!this.ws) return;
        if (this.ws.readyState !== 1) return;
        if (data.build) this.ws.send(data.build());
        else this.ws.send(data);
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
    open(){
        console.log(this.id + " connected");
        this.send(SEND_254);
        this.send(SEND_255);
        setInterval(function(){
			this.sendNick("I'm not Bot");
		}.bind(this), 1000)
    }
    close(){
        console.log(this.id + " disconnected")
    }
}