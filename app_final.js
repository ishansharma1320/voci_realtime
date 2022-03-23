 var express = require('express');
 var path = require('path');
 var app = express();
 var http = require('http').Server(app);
const mongoose = require('mongoose');
var ProcessedCall = require('./db_models/ProcessedCall');
var async = require('async');
//var http = require('http'),
  var  fs = require('fs');
   // index = fs.readFileSync(__dirname + '/index_b3.html');

/*var app = http.createServer(function(req, res) {
    //res.writeHead(200, {'Content-Type': 'text/css'});
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});
*/

var server = http.listen(3004, function () {
    ////--console.log(http.address())
    var host = http.address().address;
    var port = http.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

 var publicPath = path.resolve(__dirname, '/');
app.use('/css',express.static(__dirname +'/css'));
 app.use(express.static(publicPath));
 app.get('/', function(req, res){
      //var url = new URL(url_string);
      //var accountId = url.searchParams.get("accountId");
      //console.log(accountId);
      //res.sendFile(__dirname +'/index_b4.html', {root: publicPath});
      res.sendFile(__dirname +'/index_final.html', {root: publicPath});
 });


var coretraqEvaluations = require('./CoretraqEvaluation.js').CoretraqEvaluation
var io = require('socket.io').listen(server);
//console.log(io)
var url = "mongodb://testomnitraq:E44l0#7440#DRE@localhost:27017/unittesting";
//mongoose.createConnection(url, { useNewUrlParser: true , useUnifiedTopology: true});

 var db =  mongoose.connect(url, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
       useCreateIndex:true,
   }).then(() => console.log('Hurry Database Connected'))

//var url = "mongodb://testomnitraq:B7fgE44l0*#7440@localhost:27017/unittesting";
//var MongoClient = require('mongodb').MongoClient;
//app.listen(3003);
var socketID = [];
var contact_JsonArray = []
fs.readFile('/home/yactraq-vm15/UoP/gen_phrases.json', 'utf8', function readFileCallback(err, gen_phrases_data){
        //console.log(gen_phrases_data);
        // Send current time to all connected clients
        io.on('connection', function(socket) {
		//console.log("socketID : "+socket);
//		console.log(contact_JsonArray);		
		io.emit('streamArray', {stream : socketID, list_Of_contacts: contact_JsonArray});
//console.log(req, res)		
                socket.on('data', function(data){
			
	                //--console.log("data : "+JSON.stringify(data));
			setTimeout(function(){ processData(data);}, 700);

			function processData(u){
			//--console.log(u);
                        var contact_number = (u.contact_number).toString().replace(/[^a-zA-Z0-9]/g, "");
			//console.log("contact_number : "+contact_number)
                        var file_name = '/home/yactraq-vm15/UoP/'+contact_number+'.json';
                        var list_of_phrases_occured = [];
                        var present_phrases_occured = [];
			var speaker = (u.speaker == 'Customer') ? 'right' : 'left';
			//var gen_phrases_data = (u.speaker == 'Customer') ? gen_phrases_customer : gen_phrases_agent;
                        JSON.parse(gen_phrases_data).data.map(function(dd_data){
                                if(new RegExp("\\b" + dd_data.phrases + "\\b").test(u.utterance) && u.speaker != 'Customer'){ //dd_data.speaker){
                                        list_of_phrases_occured.push(dd_data.phrases);
					var s_time =  (new Date(u.streamStartTime)).getTime()
                                        present_phrases_occured.push({
						'speaker': speaker,
                                                'category' : dd_data.category, 
                                                'phrasesType' : dd_data.phrasesType, 
                                                'agent' : false, 
                                                'startTime': s_time,
                                                'riskFlag' : "Non-Compliant",
                                                'phrase' : dd_data.phrases
                                        })
                                }
                        })
			//--console.log("socketID : "+socketID+"    : "+contact_number)
                        if(u.status == false && !socketID.includes(contact_number)){
				console.log("okkk")
                                socketID.push(contact_number);
				var phrases_status = (list_of_phrases_occured.length > 0) ? true : false;
				var phrases_count = (list_of_phrases_occured.length > 0) ?  list_of_phrases_occured.length : 0;
				contact_JsonArray.push({'contact':contact_number, 'phrases_status': phrases_status, 'phrases_count': phrases_count});
				contact_JsonArray.sort(function(a,b){ return b.phrases_count - a.phrases_count; });
                                io.emit('streamArray', {stream : socketID, list_Of_contacts: contact_JsonArray});
                        }else if(u.status == false && socketID.includes(contact_number)){
				setPhraseStatus(contact_number, contact_JsonArray, list_of_phrases_occured.length);
				contact_JsonArray.sort(function(a,b){ return b.phrases_count - a.phrases_count; });
				//console.log("contact_JsonArray : "+JSON.stringify(contact_JsonArray))				
				io.emit('streamArray', {stream : socketID, list_Of_contacts: contact_JsonArray});	
			}

			function setPhraseStatus(contact_number, contact_JsonArray, size) {
			  for (var i = 0; i < contact_JsonArray.length; i++) {
			    if (contact_JsonArray[i] && contact_JsonArray[i].contact === contact_number) {
			      var p_status = (size > 0 || contact_JsonArray[i].phrases_status == true) ? true : false;
			      //console.log("p_status : "+p_status);
			      //if(p_status && contact_JsonArray[i].phrases_status != p_status && socketID.length > 1){
				//moveIdToTop(socketID, contact_number)
			      //}
			      //console.log("socketID : "+socketID)
			      var phrases_count = (size > 0) ? size : 0;
			      contact_JsonArray[i].phrases_count += phrases_count; 
			      //if(!contact_JsonArray[i].phrases_status == true){
			      		contact_JsonArray[i].phrases_status = p_status;
			      //}
			      return;
			    }
			  }
			}

			function moveIdToTop(listOfContact, id) {
			 for (var i = 0; i < listOfContact.length; ++i) {
			    if (listOfContact[i] == id) {
			       var temp = listOfContact[i];
			       listOfContact.splice(i, 1);
			       listOfContact.unshift(temp);
			       break;
			    }
			 }
			}
			

                        fs.readFile(file_name, 'utf8', function readFileCallback(err, data){
				//console.log("file_name: ",file_name)
                                if (err){
					var time = new Date()//.toISOString()
					//console.log("time : "+time)
					var speaker = (u.speaker == 'Customer') ? 'right': 'left'
                                        var file_data = {
                                                "account_id" : "realtime",
                                                "user_name" : "realtime",
                                                "user_email" : "realtime@yactraq.com",
                                                "call_id" : contact_number,
                                                "agent_name" : u.agentId,
                                                "start_at" :  time,
                                                "riskFlag" : "Non-Compliant",
                                                "total_time" : 0,
                                                "transcript" : [
                                                        {
                                                                "utterance" : u.utterance,
                                                                "speaker" : speaker,
                                                                "startTime": 0,//(new Date(u.streamStartTime)).getTime()
								"start_at": new Date()
                                                        }
                                                ],
                                                "present_phrases" : present_phrases_occured
                                        }

                                        fs.writeFile(file_name, JSON.stringify(file_data), { flag: 'wx' }, function (err) {
                                                if (err) throw err;
                                                //console.log("It's saved!");
                                        });
                                } else {
					var obj = require(file_name);
					console.log(typeof(data))
					var bb = {}
				 	bb = obj
					console.log(bb.transcript, typeof(bb))
					var speaker = (u.speaker == 'Customer') ? 'right': 'left'
					var startTime = 0;
					startTime = (new Date().getTime() - new Date(bb.start_at).getTime())/ 1000
					console.log("startTime : rrrrrrrrrrrrrrrrrrr : "+startTime)
					bb.transcript.push({"utterance" : u.utterance, "speaker" : speaker, "startTime": startTime, start_at: new Date()}); //add some data
					if(present_phrases_occured.length > 0) {
                                                bb.present_phrases = bb.present_phrases.concat(present_phrases_occured)
                                        }
					if(u.status){
						//console.log("Total Time : ", u.call_metadata.duration)
						bb.total_time = (new Date().getTime() - new Date(bb.start_at).getTime())/ 1000//(u.call_metadata.duration) ? parseFloat(u.call_metadata.duration) : 0;
					}
					console.log("444",bb)
                                        fs.writeFile(file_name, JSON.stringify(bb), 'utf8', function (err) {
                                                if (err) throw err;
                                                console.log('Saved!');
                                        });
					//console.log("sssssssssssssss : ", u.status)
					var json = JSON.parse(JSON.stringify(bb));
                                        if(u.status){
						console.log("In side")
                                                var index = socketID.indexOf(contact_number);
                                                if (index > -1) {
                                                        socketID.splice(index, 1);
                                                }
                                                var jsonArrayIndex = contact_JsonArray.findIndex(function(item, i){
							if(item){
                                                        	return item.contact === contact_number
							}
                                                });
                                                //contact_JsonArray.splice(jsonArrayIndex,1);
						delete contact_JsonArray[jsonArrayIndex];
						//console.log("socketID : "+socketID)
						io.emit('removeID', {contact : contact_number})
                                                io.emit('streamArray', {stream : socketID, list_Of_contacts: contact_JsonArray});
                                                
                                                //MongoClient.connect(url, { useNewUrlParser:true,useUnifiedTopology: true }, function(err, db) {
                                                //        if (err) throw err;
                                                //        db.collection("processedcalls").insertOne(JSON.parse(json), function(err, res) {
						var processedCall = new ProcessedCall(json);
						processedCall.save(function(err, res) {
                                                                if (err) throw err;
					////--			console.log("res : ",res)
                                                                //db.close();
								//json = JSON.parse(json);
coretraqEvaluations.processCallUnwind({account_id : json.account_id, call_id : json.call_id}, db, function(err){
    coretraqEvaluations.dollarValueUnwind({account_id: json.account_id, call_id: json.call_id}, db, function(dollarValueUnwindResult){
        coretraqEvaluations.redactionReport(json, db , function(redactionReportResult){
                coretraqEvaluations.agentRanking(json, db, function(agentRankingResult){
                        if(agentRankingResult){
                                coretraqEvaluations.agentRankingScore({account_id: json.account_id, agent_name: json.agent_name}, db, function(agentRankingScoreResult){
                                      	fs.unlinkSync(file_name);
					console.log("Done.....");
                                })
                        }
                })
         })
    })
})
                                                                //fs.unlinkSync(file_name)
                                                        //});
                                                });
                                        }
                                }
				//console.log("contact_JsonArray : "+JSON.stringify(contact_JsonArray));
				//console.log("socketID : "+socketID)
                        });
			/*u['list_of_phrases_occured'] =  list_of_phrases_occured;
			var new_utterance = "";
			u.utterance.split(" ").forEach(function(text, t){
				//console.log("## 111: "+text);
				if(list_of_phrases_occured.includes(text)){
					new_utterance = new_utterance + ' <span class="highlightedText_search">'+text+'</span>';
				}else{
					new_utterance = new_utterance + ' '+text;
				}
				//console.log("## 222: "+t);
			});*/
	                   	u['list_of_phrases_occured'] =  list_of_phrases_occured;
                        //console.log(list_of_phrases_occured)
                        var new_utterance = u.utterance;
                        if(list_of_phrases_occured.length > 0){
                        /*u.utterance.split(" ")*/list_of_phrases_occured.forEach(function(text, t){
                                //console.log("## 111: "+text);
                        if (u.utterance.includes(text)){
                                new_utterance = new_utterance.replace(new RegExp("\\b" + text + "\\b"), '<span class="highlightedText_search">$&</span>');
                        }
                        else{
                                new_utterance = new_utterance;
                        }
                        /*      if(list_of_phrases_occured.includes(text)){
                                        new_utterance = new_utterance + ' <span class="highlightedText_search">'+text+'</span>';
                                }else{
                                        new_utterance = new_utterance + ' '+text;
                                }
                        */      //console.log("## 222: "+t);
                        });
                        }
                        else{
                                new_utterance = new_utterance;
                        }
			u.new_utterance = new_utterance
			//console.log("uuu : "+JSON.stringify(u))        
                        io.emit('datavalues', u);
			}
                });

                socket.on('disconnect', function () {
                        //socket.emit('disconnected');
                });
        });//io connection
})//gen_phrases file read;



function calTotalTime(input){
    console.log("input : ", input)
    var newData = input; //Math.floor(parseInt(input));
    var min = parseInt(newData/60, 10);
    var sec = newData%60;
    if(min < 10 && sec < 10)
          return ("0"+min+":0"+sec);
    if (min < 10 && sec >= 10)
          return ("0"+min+":"+sec);
    if (min >= 10 && sec < 10)
          return (min+":0"+sec);
    if (min >= 10 && sec >= 10)
  	  return (min+":"+sec);
}
