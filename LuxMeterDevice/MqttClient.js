var mqtt = require('mqtt')

/*client.on('message', function (topic, message) {
    // message is Buffer 
    console.log(message.toString())
    client.end()
})
*/
var MqttClient = function MqttClient(opts) {
    this.opts = opts;

    return this;
}

MqttClient.prototype.init = function MqttClient(ligthCB){
    console.log("Init MqttClient");
    this.ligthCB = ligthCB;
 
    thisclient = this.client = mqtt.connect('mqtt://BCN-CBWPK32.usersad.everis.int')

    thisclient.on('connect', function () {
        console.log("Connected", thisclient.options.clientId);
        thisclient.subscribe('luxMetterCmd')
    })
    self = this;
    thisclient.on('message', function (topic, message) {
        // message is Buffer 
        if (topic == "luxMetterCmd") {
            obj = JSON.parse(message.toString());
            if (obj.thingId == "raspi1") {
                console.log(message.toString())
                self.ligthCB(obj);
            }
        }
        
    })
}

MqttClient.prototype.sendData = function mqttSendData(data) {
    str = JSON.stringify(data);
    this.client.publish('luxMetterData',str );
    console.log("Sended:", str.length, "Bytes");
}

module.exports = MqttClient;