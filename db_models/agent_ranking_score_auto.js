'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Mixed = Schema.Types.Mixed;
var ObjectId = mongoose.ObjectId;

var AgentRankingScoreSchema = new mongoose.Schema({}, { strict: false });
module.exports = mongoose.model('AgentRankingScore', AgentRankingScoreSchema);

