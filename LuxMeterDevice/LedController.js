var gpio = require('rpi-gpio');

LedController = function () {
    this.status = 0;
}

function setupCB(err) {
    if (err) {
        console.error(err);
    }
    //console.log("setupCB");
}
function writeCB(err) {
    if (err) {
        console.error(err);
    }
    //console.log("writeCB");
}

LedController.prototype.init = function LedCtrlInit(buttonCb) {
    console.log("Init LedController");
    var self = this;
    this.trigger = false;
    this.btnCb = buttonCb;
    gpio.setMode(gpio.MODE_BCM);
    gpio.setup(21, gpio.DIR_OUT, setupCB);
    gpio.setup(12, gpio.DIR_IN, gpio.EDGE_BOTH, setupCB);
    gpio.on('change', function (channel, value) {
        //console.log('Channel ' + channel + ' value is now ' + value);
        if (channel == 12 && !value) {
            self.trigger = true;
            return;
        }
        if (channel == 12 && value && self.trigger) {
            self.trigger = false;
            setImmediate(self.btnCb, self);
        }
    });
}

LedController.prototype.set = function LedCtrlSet(nStatus) {
    //console.log("Set led to :", nStatus)
    var desired = (nStatus == 1) ? 1 : 0;
    gpio.write(21, desired, writeCB);
    this.status = desired;
}

LedController.prototype.setOn = function LedCtrlOn() {
    this.set(1);
}

LedController.prototype.setOff = function LedCtrlOff() {
    this.set(0);
}

LedController.prototype.toggle = function LedCtrlToggle() {
    //console.log("led tooggle");
    this.set(!this.status);
}

module.exports = LedController;