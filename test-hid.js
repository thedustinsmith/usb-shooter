var hid = require('node-hid');
var devices = hid.devices();

var rocket = new hid.HID('USB_2123_1010_14500000');

rocket.on('data', function (d) {
	console.log("got data:");
	console.log(d);
});

var cmds = {
	open: 0x02,
	up: 0x06,
	down: 0x07,
	right: 0x08,
	left: 0x04,
	stop: 0x00,
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

	sendCommand(i[0], i[1]);
}

function sendCommand(cmd, len) {
	rocket.write([cmds.open, cmds[cmd]]);
	setTimeout(function() {
		console.log('stopping');
		rocket.write([cmds.open, cmds.stop]);
	}, len);
}

// handling Ctrl + C
process.on('SIGINT', exit);

console.log("Welcome to the fire fighter.  Please enter your command:");
process.stdin.resume();
process.stdin.on('data', function(d) {
	var data = d.toString().toLowerCase().trim().split(' ');
	processInput(data);
});

rocket.write([cmds.led, cmds.ledOn]);

//rocket.write([0x02, 0x05]); //left & down
//rocket.write([0x02, 0x06]); // up
//rocket.write([0x02, 0x07]); // down
//rocket.write([0x02, 0x08]); // right
//rocket.write([0x02, 0x10]); // shoot
//rocket.write([0x02, 0x11]); // fire
//rocket.write([0x02, 0x12]); // up and fire
//rocket.write([0x02, 0x13]); // down and fire
//rocket.write([0x02, 0x14]); // fire
//rocket.write([0x02, 0x15]); // fire
//rocket.write([0x02, 0x16]); // up and fire
//rocket.write([0x02, 0x17]); // down and fire
//rocket.write([0x02, 0x18]); // right down and fire
//rocket.write([0x02, 0x19]); // down and fire
//rocket.write([0x02, 0x1a]); // right up and fire
//rocket.write([0x02, 0x1b]); // right down and fire ?
//rocket.write([0x02, 0x1c]); // left down and fire ?
//rocket.write([0x02, 0x1d]); // same as above/
//rocket.write([0x02, 0x1e]); // left up and fire
//rocket.write([0x02, 0x1f]); // left down and fire
