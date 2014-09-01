var usb = require('usb');
var list = usb.getDeviceList();

console.log(list);
console.log('===========');
var rocket = usb.findByIds(8483,4112);

rocket.open();

var rocketInt = rocket.interfaces[0];
var endPoint = rocketInt.endpoints[1];

console.log(rocketInt.endpoints.length);
rocket.close();