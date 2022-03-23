
const express = require('express');
const bodyParser = require("body-parser")
const app = express();
const PORT = 9002;
app.use(bodyParser.json())

var io = require('socket.io-client');
var socket = io.connect('http://71.19.240.131:3004', {reconnect: true});

// Add a connect listener
socket.on('connect', function (sockets) {
    console.log('Connected!');
});

app.post('/transcriptstream', (req, res) => {
console.log("####################################################################################################################")
console.log(req.body)
if(req.headers["x-api-token"]== "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiY29udGFxdCI"){
//console.log(typeof(req.body))
req.body.contact_number = (req.body.remoteparty) ? req.body.remoteparty : req.body.fromNumber;
req.body.utterance = (req.body.text) ? req.body.text : "";
req.body.speaker = (req.body.speaker == 'Customer') ? 'Customer' : 'Agent'; 
req.body.streamStartTime = new Date(Number(req.body.engagementStartTime)*1000)
req.body.status = (req.body.type && req.body.type == "stop") ? true : false;

socket.emit('data', JSON.parse(JSON.stringify(req.body)));
//	console.log(req.body)
        res.status(200).end() 	

}
else{
console.log("Invalid Token");
res.status(401);
}
});
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);

});
