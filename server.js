// server.js
var express = require('express');  
const TPLSmartDevice = require('tplink-lightbulb')
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server); 
var colorsys = require('colorsys')

var bip = ''; // Enter the bulbs IP - You can find this using your router or the scan command on Konsumer's tplink-lightbulb API.

var bbrightness = 100;

app.use(express.static(__dirname + '/public')); 
//redirect / to our index.html file
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(client) { 
	console.log('Client connected...'); 
	//when the server receives clicked message, do this
    client.on('on', function(data) {
		console.log('');
		console.log('On');

		  io.emit('lightstatusup', 'On');
		  
		const bulb = new TPLSmartDevice(bip)
		var brightnum = Number(bbrightness);
		bulb.power(true, 0, {brightness: brightnum})
		//bulb.power(true, 0, {hue: color.h, saturation: color.s, brightness: color.l, color_temp: 0})
		  
    });

    client.on('off', function(data) {
		console.log('');
		console.log('Off');

		  io.emit('lightstatusup', 'Off');
		  const bulb = new TPLSmartDevice(bip)
		  bulb.power(false, 0)

		});

	client.on('scan', function(data) {
		console.log('');
		console.log('Scanning');
		
		// turn first discovered light off
		const scan = TPLSmartDevice.scan()
		.on('light', light => {
			light.power(false)
			.then(status => {
				console.log(status)
				scan.stop()
			})
		})
		
		});
		
	client.on('hex', function(data) {
		console.log('');
		console.log('Colour given:');
		console.log('Hex: ' + data.hex);
		const color = colorsys.hexToHsl(data.hex)
		//console.log('Hsl: ' + color.l);
		console.log('Brightness Given: ' + data.brightness);
		bbrightness = data.brightness;
		console.log('Var Brightness: ' + bbrightness);
		var brightnum = Number(bbrightness);
		
		console.log('');
		console.log('Sending to Bulb');
		const bulb = new TPLSmartDevice(bip)
		bulb.power(true, 0,{hue: color.h, saturation: color.s, brightness: brightnum, color_temp: 0})
		//.then(status => {
		//	console.log(status)
		//})
		//.catch(err => console.error(err))

		});
		
});

//start our web server and socket.io server listening
server.listen(80, function(){
  console.log('listening on *:80');
}); 