// server.js
var express = require('express');  
const TPLSmartDevice = require('tplink-lightbulb')
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server); 
var hexToHsl = require('hex-to-hsl');

//keep track of how times clients have clicked the button
var clickCount = 0;

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
    	  //clickCount++;
		  //send a message to ALL connected clients
		  //io.emit('buttonUpdate', clickCount);#
		  io.emit('buttonUpdate', 'On');
		  
    });

    client.on('off', function(data) {
		console.log('');
		console.log('Off');
		
    	  //clickCount++;
		  //send a message to ALL connected clients
		  io.emit('buttonUpdate', 'Off');
		  // turn first discovered light off
		  
		
		
		});

	client.on('scan', function(data) {
		console.log('');
		console.log('Scanning');
		
    	  //clickCount++;
		  //send a message to ALL connected clients
		  //io.emit('buttonUpdate', 'Off');
		  // turn first discovered light off
		const scan = TPLSmartDevice.scan()
		console.log(scan)
		scan.stop()
		
		
		});
		
	client.on('hex', function(data) {
		console.log('');
		console.log('Colour given:');
		console.log('Hex: ' + data.hex);
		const color = hexToHsl(data.hex)
		console.log('Hsl: ' + color);
		
		console.log('');
		console.log('Sending to Bulb');
		const bulb = new TPLSmartDevice('')
		bulb.power(true, 0, {hue: color.h, saturation: color.s, brightness: color.l, color_temp: 0})
		
		});
		
		
});

//start our web server and socket.io server listening
server.listen(80, function(){
  console.log('listening on *:80');
}); 