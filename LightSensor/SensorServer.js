var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cons = require('consolidate');
var swig = require('swig');
var path = require('path');

var ExpressWs = require('express-ws');
var WebSocket = require('ws');

var SensorServer = function SensorServer(opts) {
    this.opts = opts;
    return this;
}

SensorServer.prototype.init = function SensorServerInit() {
    console.log("Init SensorServer");

    this.app = express();
    this.expressWs = ExpressWs(this.app);
    this.app.use(bodyParser.urlencoded());
    this.app.use(bodyParser.json());
    this.app.use(methodOverride());

    this.app.engine('server.view.html', cons['swig']);
    this.app.set('view engine', 'server.view.html');
    this.app.set('views', './app/views');
    this.app.use(express.static(path.resolve('./public')));

    this.app.route('/')
        .get(function (req, res, next) {
            res.render('graph');
        });

    this.clients = [];
    thisSensorServer = this;
    this.app.ws('/', function (ws, req) {
        var client_id = req.connection.remoteAddress + "_" + req.connection.remotePort;
        if (!thisSensorServer.clients[client_id]) {
            thisSensorServer.clients[client_id] = ws;
            ws.id = client_id;
            console.log("new client: ", ws.id);
        }
        ws.on('close', function close() {
            console.log('disconnected ', ws.id);
            thisSensorServer.clients[ws.id] = null;
        });

        ws.on('message', function incoming(message) {
            console.log('ws', ws.id);
            console.log('received: %s', message);
        });
    });

}

function sendCallback(err) {
    if (err) console.error("send() error: " + err);
}


SensorServer.prototype.listen = function sensorServerListen() {
   this.app.listen(3000, function () {
        console.log('Raspi Express server listening...');
    });
}

SensorServer.prototype.pushData = function sensorServerPushData(message) {
    this.expressWs.getWss().clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message), sendCallback);
        }
    });
}


/*
function sendCallback(err) {
    if (err) console.error("send() error: " + err);
}

client.on('message', function (topic, message) {
    // message is Buffer 
    console.log(message.toString())
    //client.end()
    expressWs.getWss().clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message.toString(), sendCallback);
        }
    });
})
*/

module.exports = SensorServer;