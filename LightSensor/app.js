console.log('Hello world');
var SensorReader = require('./I2CLuxMetter');
var DataManager = require('./DataManager');
var IoTHubClient = require('./AwsMqttClient');
var SensorServer = require('./SensorServer');

var sensor = new SensorReader();
var sensorMgr = new DataManager();
var secondMgr = new DataManager({ limit: 20 });
var iotHub = new IoTHubClient();
var server = new SensorServer();

var fileOut = 'data/data.out'; 

sensor.init();
sensorMgr.init();
secondMgr.init();

server.init();
server.listen();

iotHub.init();

/*
if (!fs.existsSync(fileOut)) {
    console.log('No existe');
    fs.writeFileSync(fileOut, '//ts,I2C\n');
}
*/

function cbReadOne(date, value) {
    data = { date: date, value: value };
    //console.log('Data: ' + JSON.stringify(data));
    sensorMgr.pushSensorData(data, cbReadSecond);
    //wsData = { type: 'RT', data: data };
    //server.pushData(wsData);
    //fs.appendFile(fileOut, date +"," +value+",\n");
}

function cbReadSecond(secondData) {
    var str = JSON.stringify(secondData);
    //console.log('secondData: ' + str);
    //console.log('secondData: ' + str.length);
    secondMgr.pushSensorData(secondData, cbRead20Second);
    wsData = { type: 'Second', data: secondData };
    server.pushData(wsData);
    today = new Date();
    
    iOtData = {
        id: 'Raspi1',
        date: today.toISOString(),
        thing1: {
            'id': '1',
            'date': new Date(secondData.date).toISOString(),
            'value': secondData.value,
        }
    };

    iotHub.sendData(iOtData);
}

function cbRead20Second(secondData) {
    var str = JSON.stringify(secondData);
    //console.log('20secondData: ' + str);
    //console.log('20secondData: ' + str.length);
    wsData = { type: '20Second', data: secondData };
    server.pushData(wsData);
    //iOtData = {
    //    id: 'raspi1', date: secondData.date, value: secondData.value, light: led.status, samples: []
    //};

    /*for (i = 0; i < secondData.samples.length; i++) {
        iOtData.samples.push({
            date: secondData.samples[i].date, value: secondData.samples[i].value
        });
    }*/
    //iotHub.sendData(iOtData);
}
setInterval(function () {
    sensor.readOne(cbReadOne);
}, 200);
