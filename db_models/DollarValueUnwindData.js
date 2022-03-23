'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.ObjectId;

var DollarValueSchema = new mongoose.Schema(
    {
	account_id: String,
	call_id: String,
        agent_name: String,
        total_time: Number,
	dollar_value: [{
                key_data : String,
                key_value : Number,
                key_time: String
        }]
    }
);

module.exports = mongoose.model('DollarValueUnwindData', DollarValueSchema);
