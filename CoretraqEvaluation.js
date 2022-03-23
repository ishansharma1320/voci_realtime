var CoretraqEvaluation = function() {};

var ProcessedCall = require('./db_models/ProcessedCall.js');
var phrasesList_DB = require('./db_models/CustomCatPhrase.js');      
var AgentRanking = require('./db_models/AgentRanking_auto.js');
var AgentRankingScore = require('./db_models/agent_ranking_score_auto.js')
var CustomCatPhrase = require('./db_models/CustomCatPhrase.js') 
var _ = require("underscore");
var mongoose = require('mongoose');
var mongoCred = {
    user: 'omnitraq',
    pass: 'B7fgE44l0*#7440'
}
var mongoURL = "mongodb://localhost/TestingTestSchema";
var accountId = "connectq"
//mongoose.connect('mongodb://localhost/TestingTestSchema', mongoCred);

/*
**	Agent Ranking Evaluation
**	Parameters :-  Processed Call Data (JSON Format)
**	Output :- Stored in agentrankings collection
*/ 
CoretraqEvaluation.prototype.agentRanking = function(processed_Call, db, cbb) {
	//mongoose.connect(mongoURL, mongoCred);
	//var db = mongoose.connection;
//	db.on('error', console.error.bind(console, 'connection error:'));
	console.log("Coretraq Evaluation AgentRanking : "+processed_Call.call_id);
//	db.once('open', function callbak(t) {
		console.log("Mongo connected for Agent Ranking");
		console.log(JSON.parse(JSON.stringify(processed_Call)))
		var account_id = processed_Call.account_id;
		phrasesList_DB.distinct("phrasesType", {
		    'account_id': accountId
		}, function(error, phrasesType_List) {
		    console.log('data processing ...'+phrasesType_List);
		    jsonObj_phraseType = {};
		    phrasesType_List.map(function(phrasesType, index) {
		        var phrasesTypeName = (phrasesType.replace(/ /g, "_")) + "_present_phrases";
		        phrasesList_DB.distinct("category", {
		            'account_id': accountId,
		            phrasesType: phrasesType
		        }, function(error, category_List) {
		            var categoryData = (processed_Call.hasOwnProperty('present_phrases')) ? (processed_Call.present_phrases.filter(x => x.phrasesType == phrasesType)).map(function(phrase) {
		                return phrase.category.trim()
		            }) : [];
		            var count = 0;
		            var phrase_count = 0;
		            var jsonObj = {};
		            category_List.map(function(category) {
		                var a = category.replace(/ /g, "_");
		                var len = categoryData.filter(function(x) {
		                    return x === category
		                }).length;
		                (len > 0) ? count++ : 0;
		                phrase_count += len;
		                jsonObj[a] = categoryData.filter(function(x) {
		                    return x === category
		                }).length;
		            });
		            var score = parseInt((count / category_List.length) * 100);
		            jsonObj.score = score;
		            jsonObj.totalScore = phrase_count;
		            jsonObj_phraseType[phrasesTypeName] = jsonObj;
		            if (phrasesType_List.length - 1 == index) {
		                jsonObj_phraseType.account_id = processed_Call.account_id;
		                jsonObj_phraseType.call_id = processed_Call.call_id;
		                jsonObj_phraseType.agent_name = processed_Call.agent_name;
				var agentRanking = new AgentRanking(jsonObj_phraseType);
		                agentRanking.save(function(er, da) {
			            console.log("Agent Ranking Processing completed")
		                    cbb(true);
		                });
		            }
		        });
		    });
		    if(phrasesType_List.length == 0){
			cbb(true);
		    }
		});
//	});
}; //End Of Agent Ranking 


var AgentRankingScore = require('./db_models/agent_ranking_score_auto.js');
var CategoryRankingData = require('./db_models/AgentRanking_auto.js');

/*
**	Agent Ranking Score Evaluation
**	Parameters :-  account_id and agent_name (JSON Format)
**	Output :- Stored in agentrankingscores collection
*/ 
CoretraqEvaluation.prototype.agentRankingScore = function(data, db, cb) {
	//mongoose.connect(mongoURL, mongoCred);
	//var db = mongoose.connection;
	var account_id = data.account_id;
	var agent = data.agent_name;
	console.log("Coretraq Evaluation Agent Ranking Score Processing : "+account_id);
//	db.on('error', console.error.bind(console, 'connection error:'));
//	db.once('open', function callbak(t) {
		console.log("mongo connected for Agent Ranking Score...");
		AgentRanking.find({
		    "account_id": accountId,//account_id,
		    "agent_name": agent
		}, function(error, agentRankingList) {
		    CustomCatPhrase.distinct("phrasesType", {
		        'account_id': accountId
		    }, function(error, phrasesType_List) {
			console.log("data processing ...");
		        jsonObj_phraseType = {};
		        phrasesType_List.map(function(phrasesType, index) {
		            var count = 0;
		            var phrasesTypeName = (phrasesType.replace(/ /g, "_")) + "_present_phrases";
		            var score = (phrasesType.replace(/ /g, "_")) + "_score";
		            CustomCatPhrase.distinct("category", {
		                'account_id': accountId,
		                phrasesType: phrasesType
		            }, function(error, category_List_Data) {
		                agentRankingList.map(function(item) {
		                    var data = JSON.parse(JSON.stringify(item))[phrasesTypeName];
		                    if (!(data == null && data == "undefined" && data == "")) {
		                        category_List_Data.map(function(x) {
		                            if (typeof data === 'undefined') {
		                                return count
		                            } else {
		                                return (data[x.replace(/ /g, "_")] > 0) ? count++ : count
		                            }
		                        })
		                    } else {

		                    }
		                });
		                parseInt((count / agentRankingList.length) * 100)
		                jsonObj = {};
		                jsonObj.calls_count = agentRankingList.length
		                jsonObj.account_id = account_id
		                jsonObj.agent_name = agent
		                jsonObj[phrasesType + "_score"] = parseInt((parseInt((count / agentRankingList.length) * 100)) / category_List_Data.length)
		                AgentRankingScore.update({
		                    account_id: accountId,//account_id,
		                    agent_name: agent
		                }, {
		                    $set: jsonObj
		                }, {
		                    upsert: true
		                }, function(err, doc) {
		                    if (err) console.log(err);
		                    console.log("Processing completed for Agent : " + agent);
					if(phrasesType_List.length - 1 == index){
							cb(true);
					}
		                });
		            });
		        });
		    
			if(phrasesType_List.length == 0){
				cb(true);
			}

		     });	
		});
	//});
} //End Of Agent Ranking Score


var ProcessedCall = require('./db_models/ProcessedCall.js');
var ProcessCallsUnwindData = require('./db_models/ProcessCallsUnwindData.js');

/*
**	Unwind Present Phrases from Process Call data
**	Parameters :-  account_id and call_id (String Format)
**	Output :- Stored in processcallsunwinddatas collection
*/ 
CoretraqEvaluation.prototype.processCallUnwind = function(datas, db,cb) {
	//mongoose.connect(mongoURL, mongoCred);
	//var db = mongoose.connection;
	//db.on('error', console.error.bind(console, 'connection error:'));
	console.log("Coretraq Evaluation processCall Unwind "+datas.call_id)
	//db.once('open', function callbck(t) {
		console.log("mongo connected...");
		ProcessedCall.aggregate([{
		        "$match": {
		            "account_id": datas.account_id 
		        }
		    }, {
		        "$match": {
		            "call_id": datas.call_id
		        }
		    }, {
		        "$unwind": "$present_phrases"
		    }, {
		        "$project": {
		            "account_id": 1,
		            "user_name": 1,
		            "call_id": 1,
		            "contact_phone_number": 1,
		            "agent_name": 1,
		            "start_at": 1,
		            "riskFlag": 1,
		            "total_time": 1,
		            "present_phrases": 1,
		            "_id": 0
		        }
		    }],
		    function(err, data) {
			console.log("data processing ...");
			console.log("YY KK ::"+data.length +" :: ")
		        if (err)
		            throw err;
			else if (data.length) {
		            var final_result = JSON.parse(JSON.stringify(data)).map(function(item, index) {
		                setTimeout(function() {
		                    item.category = item.present_phrases.phrasesType;
		                    new ProcessCallsUnwindData(item).save(function(err) {
		                        if (err) {
		                            console.log(err);
		                        }
		                        //console.log('saved' + index + ' ' + item.category + ' ' + data.length);
		                        if (index >= data.length - 1) {
					    console.log("Processing completed");	
		                            cb();
		                        }
		                    });
		                }, 10);
		            });
		        } else {
		            console.log("Processing completed");
		            cb();
		        }
		    });
	//	});	
}

var DollarValueUnwindData = require('./db_models/DollarValueUnwindData.js');

/*
**	Unwind Dollar value from Process Call data
**	Parameters :-  account_id and call_id (String Format)
**	Output :- Stored in dollarvalueunwinddatas collection
*/ 
CoretraqEvaluation.prototype.dollarValueUnwind = function(data, db, cb) {
	//mongoose.connect(mongoURL, mongoCred);
	var account_id = data.account_id, call_id = data.call_id;
	//var db = mongoose.connection;
	//db.on('error', console.error.bind(console, 'connection error:'));
	console.log("Coretraq Evaluation Dollar Value Unwind : "+account_id);
	//db.once('open', function callback(t) {
		console.log("mongo connected...");
		ProcessedCall.aggregate([{
		        "$match": {
		            "account_id": account_id 
		        }
		    }, {
		        "$match": {
		            "call_id": call_id
		        }
		    }, {
		        "$unwind": "$dollar_value"
		    }, {
		        "$project": {
		            "account_id": 1,
		            "call_id": 1,
		            "agent_name": 1,
		            "total_time": 1,
		            "dollar_value": 1,
		            "_id": 0
		        }
		    }],
		    function(err, data) {
			console.log("data processing ...");
		        if (err)
		            throw err;
		        else if (data.length) {
		            var final_result = JSON.parse(JSON.stringify(data)).map(function(item, index) {
		                setTimeout(function() {
		                    //item.category = item.present_phrases.phrasesType;
				    console.log("Item : "+item);
		                    new DollarValueUnwindData(item).save(function(err) {
		                        if (err) {
		                            console.log(err);
		                        }
		                        //console.log('saved' + index + ' ' + item.category + ' ' + data.length);
		                        if (index >= data.length - 1) {
					    console.log("Processing completed");
		                            cb();
		                        }
		                    });
		                }, 10);
		            });
		        } else {
			    console.log("Processing completed ");	
		            cb()
		        }
		    });
	//	});	
}

var RedactionReportData = require('./db_models/RedactionReportData.js');

/*
**	Transcript value from Process Call data
**	Parameters :-  Process Call (JSON Format)
**	Output :- Stored in redactionreportdatas collection
*/ 
CoretraqEvaluation.prototype.redactionReport = function(pcall, db, cb) {
	//mongoose.connect(mongoURL, mongoCred);
	//var db = mongoose.connection;
	//db.on('error', console.error.bind(console, 'connection error:'));
	console.log("Coretraq Evaluation Redaction Report Processing : "+pcall.account_id);
	//db.once('open', function callback(t) {
		console.log("mongo connected...");
		console.log("Transcript : "+pcall.transcript);
		if(typeof pcall.transcript != 'undefined'){
		pcall.transcript.map(function(transcript, index) {
			if (transcript.utterance.indexOf('*') > -1) {
				var array_of_utterance = transcript.utterance.split(/\s+/);
				var temp_ele = "";
				var matching_word = "";
				var jsonObj = {};
				for (var i = 0; i <= array_of_utterance.length; i++) {
				    if (array_of_utterance[i] == '*') {
				        temp_ele += array_of_utterance[i];
				        matching_word += array_of_utterance[i];
				    } else {
				        if (temp_ele.length > 1 && array_of_utterance[i + 1] == '*' && array_of_utterance[i - 1] == '*') {
				            matching_word += array_of_utterance[i];
				        } else if (temp_ele.length > 2 && array_of_utterance[i + 1] != '*') {
				            var jsonObj = {
						account_id: pcall.account_id,
				                startTime: transcript.startTime,
				                call_id: pcall.call_id,
				                agent_name: pcall.agent_name,
				                count: temp_ele.length,
				                word: matching_word
				            };
				new RedactionReportData(jsonObj).save(function(err) {
		                        if (err) {
		                            console.log(err);
		                        }
								if(pcall.transcript.length - 1 == index){
									console.log("Processing completed IN REDACTION");
									cb(true);
								}
		                    });
				            temp_ele = "";
				            matching_word = "";
				        }
						
				    }
				}
			} else {
				if(pcall.transcript.length - 1 == index){
                                                                        console.log("Processing completed IN REDACTION");
                                                                        cb(true);
                                                                }
			}
		});
		}else{ 
			cb(true);
		}
	//});	
}

exports.CoretraqEvaluation = new CoretraqEvaluation();
