var serialPort = require('serialport');
serialPort.list(function (err, ports) {
	console.log(ports.length);
});