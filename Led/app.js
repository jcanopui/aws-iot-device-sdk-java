console.log('Hello world');

var DataManager = require('./DataManager');
var IoTHubClient = require('./AwsMqttClient');
var LedController = require('./LedController');

var sensorMgr = new DataManager();
var iotHub = new IoTHubClient();
var led = new LedController();

var fileOut = 'data/data.out'; 

sensorMgr.init();

led.init(function toogleLed(param) {
    console.log("Button pressed");
    led.toggle();
});

iotHub.init(function ligthCB(value) {
    led.set(value);
});
