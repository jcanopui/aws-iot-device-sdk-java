var DataManager = function DataManager(opts) {
    this.opts = opts || {};
    this.limit = this.opts.limit || 5;
    return this;
}

DataManager.prototype.init = function DataManagerInit(){
    console.log("Init Data Manager (", this.limit,")");
    this.sensorData = [];
    this.sensorMedia = 0;
}

DataManager.prototype.pushSensorData = function DataManagerPushSensorData(data,cb) {
    thisSensor = this;
    thisSensor.sensorData.push(data);
    thisSensor.sensorMedia += data.value / thisSensor.limit;

    if (thisSensor.sensorData.length == thisSensor.limit) {
        //console.log("sendCB");
        firstData = this.sensorData;
        mediaData = this.sensorMedia;
        setImmediate(function (fData, mData) {
            var sData = { date: fData[thisSensor.limit-1].date, value: mData, samples:fData };
            cb(sData);
        }, firstData, mediaData);
        thisSensor.sensorData = [];
        thisSensor.sensorMedia = 0;
    }
}

module.exports = DataManager;