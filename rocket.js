var hid = require('node-hid');
var devices = hid.devices();
var vendorId = 8483;
var productId = 4112;

var vendor = devices.filter(function (d) {
	return d.vendorId === vendorId && d.productId == productId;
});
if(vendor.length === 0) {
	console.error("No Missile Launchers Detected");
	process.exit(1);
}
var rocket = new hid.HID(vendor[0].path);

rocket.on('data', function (d) {
	console.log("got data:");
	console.log(d);
});
rocket.on('error', function (err) {
	console.log("device error: " + err);
	rocket.close();
	process.exit();
});

var cmds = {
	stop: 0x00,
	open: 0x02,
	up: 0x02,
	down: 0x03,
	left: 0x04,
	right: 0x08,
	fire: 0x10,
	led: 0x03,
	ledOn: 0x01,
	ledOff: 0x00
};

function exit () {
	console.log("exiting");
	rocket.write([cmds.open, cmds.stop]);
	rocket.write([cmds.led, cmds.ledOff]); // turn led off
	rocket.close();
	process.exit();
}

function processInput(i) {
	if (i.length === 1 && i[0] === 'exit') {
		exit();
		return;
	}

	if (i.length === 1) {
		i.push(500); // default length is 500ms
	}

	i[1] = parseInt(i[1], 10);

	if(i[0] === 'fire') {
		i[1] = 5000;
	}

	console.log(i);
	if (!cmds[i[0]]) {
		console.error('Please enter a valid command (up, down, left, right, fire, exit)');
		return;
	}

	try {
		sendCommand(i[0], i[1]);
	}
	catch (exc) {
		console.error("Error when trying to send command: " + exc);
		process.exit();
	}
}

function sayHi(cb) {
	sendCommand('up', 1500, function () {
		sendCommand('down', 500);
	});
	// sendCommand('left', 7000, function() {
	// 	sendCommand('right', 3250, function() {
	// 		sendCommand('up', 1500, function() {
	// 			sendCommand('down', 500);
	// 		});
	// 	});
	// });
}

function sendCommand(cmd, len, cb) {
	console.log("Sending command", cmd, len);
	rocket.write([cmds.open, cmds[cmd]]);
	setTimeout(function() {
		rocket.write([cmds.open, cmds.stop]);
		if(cb) {
			cb();
		}
	}, len);
}

// handling Ctrl + C
process.on('SIGINT', exit);

sayHi();
console.log("Welcome to the fire fighter.  Please enter your command:");
process.stdin.resume();
process.stdin.on('data', function(d) {
	var data = d.toString().toLowerCase().trim().split(' ');
	processInput(data);
});

rocket.write([cmds.led, cmds.ledOn]);
