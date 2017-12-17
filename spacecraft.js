/*
 Spacecraft.js simulates a small spacecraft generating telemetry.
*/

function Spacecraft() {
    this.state = {
        "prop.power": 77,
        "prop.motor": "OFF",
        "comms.recd": 0,
        "comms.sent": 0,
        "prop.temp": 245,
        "prop.acc": [8.15, 9.23, 10.5],
    };
    this.history = {};
    this.listeners = [];
    Object.keys(this.state).forEach(function (k) {
        this.history[k] = [];
    }, this);

    setInterval(function () {
        this.updateState();
        this.generateTelemetry();
    }.bind(this), 1000);
};

Spacecraft.prototype.updateState = function () {
    this.state["prop.power"] = Math.max(
        0,
        this.state["prop.power"] -
            (this.state["prop.motor"] === "ON" ? 0.5 : 0)
    );
    this.state["prop.temp"] = this.state["prop.temp"] * 0.985
        + Math.random() * 0.25 + Math.sin(Date.now());
};

/**
 * Takes a measurement of spacecraft state, stores in history, and notifies 
 * listeners.
 */
Spacecraft.prototype.generateTelemetry = function () {
    var timestamp = Date.now(), sent = 0;
    Object.keys(this.state).forEach(function (id) {
	  var state = (Array.isArray(this.state[id])) ?  { timestamp: timestamp, x: this.state[id][0], y: this.state[id][1], z: this.state[id][2], id: id} : { timestamp: timestamp, value: this.state[id], id: id};
        this.notify(state);
        this.history[id].push(state);
        this.state["comms.sent"] += JSON.stringify(state).length;
    }, this);
};

Spacecraft.prototype.notify = function (point) {
    this.listeners.forEach(function (l) {
        l(point);
    });
};

Spacecraft.prototype.listen = function (listener) {
    this.listeners.push(listener);
    return function () {
        this.listeners = this.listeners.filter(function (l) {
            return l !== listener;
        });
    }.bind(this);
};

module.exports = function () {
    return new Spacecraft()
};
