'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.ObjectId;

var RedactionReport = new mongoose.Schema(
    {
	account_id: String,
	call_id: String,
        agent_name: String,
        startTime: Number,
	count: Number,
	word: String
    }
);

module.exports = mongoose.model('redactionreportdata', RedactionReport);
