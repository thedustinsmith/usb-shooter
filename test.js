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
	console.log('data: ' + d);
});
rocket.on('error', function (err) {
	console.log('error: ' + err);
});

var cmd = 0x10;
var len = 3500;

rocket.write([0x02, cmd, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]);
setTimeout(function () {
	rocket.write([0x02, 0x20, 0x0, 0x0, 0x0, 0x0, 0x0]);
	rocket.close();
}, len);

// todo these need updating
//rocket.write([0x02, 0x05]); //left & down
//rocket.write([0x02, 0x06]); // left & up
//rocket.write([0x02, 0x07]); // down & down
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