var BH1750 = require('./BH1750');



var I2CLuxMetter = function I2CLuxMetter(opts) {
    this.opts = opts;
}

I2CLuxMetter.prototype.init=function I2CLuxMetterInit(){
    console.log("Init I2C Lux Metter");
    thisLux = this;
    this.i2c = new BH1750(thisLux.opts);
}

I2CLuxMetter.prototype.readOne = function I2CLuxMetterReadOne(cb) {
    thisLux = this;
    date = Date.now();
    this.i2c.readLight(function (value) {
        //console.log("light value is: ", value, "lx");
        cb(date, value);
    });
}

module.exports =I2CLuxMetter