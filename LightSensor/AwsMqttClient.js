const deviceModule = require('aws-iot-device-sdk').device;
var ProxyAgent = require('proxy-agent');

var AwsMqttClient = function AwsMqttClient(opts) {
    this.opts = opts;
    return this;
}

AwsMqttClient.prototype.init = function MqttClient(){
    console.log("Init ThisMqttClient");
 
    thisclient = this.client = deviceModule({
        keyPath: 'aws/Raspi1.private.key',
        certPath: 'aws/Raspi1.cert.pem',
        caPath: 'aws/root-CA.crt ',
        clientId: 'raspi1-' + Math.floor((Math.random() * 100000) + 1),
        region: 'us-east-1',
        baseReconnectTimeMs: 4000,
        keepalive: 30,
        protocol: 'wss',
        //port: args.Port,
        host: 'a37hc7nazelgx0.iot.us-east-1.amazonaws.com',
        debug: true,
        //AWS_ACCESS_KEY_ID
        accessKeyId: 'XXXXXXXXXXXXXXXXXXXX',
        //AWS_SECRET_ACCESS_KEY
        secretKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
//        websocketOptions: { agent: new ProxyAgent('http://10.121.8.100:8080') }
    });

    thisclient
        .on('connect', function () {
            console.log('connect');
        });
    thisclient
        .on('close', function () {
            console.log('close');
        });
    thisclient
        .on('reconnect', function () {
            console.log('reconnect');
        });
    thisclient
        .on('offline', function () {
            console.log('offline');
        });
    thisclient
        .on('error', function (error) {
            console.log('error', error);
        });
    thisclient
        .on('message', function (topic, payload) {
	    var jsonStr = JSON.parse(payload.toString());
//	    console.log('Message received from:', topic,  jsonStr);
//          console.log('message', topic, jsonStr.thing1.action);
            setImmediate(lightCB,jsonStr.state.desired.ledValue);
        });
}

AwsMqttClient.prototype.sendData = function mqttSendData(data) {
    str = JSON.stringify(data);
    this.client.publish('topic/LightMeasure/'+data.id,str );
    console.log("Sended:", str.length, "Bytes");
}

module.exports = AwsMqttClient;
