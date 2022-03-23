'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.ObjectId;

var ProcessSchema = new mongoose.Schema(
    {
	account_id: String,
	user_name: String,
	riskFlag: String,
	call_id: String,
        agent_id: String,
        contact_phone_number: String,
        start_at: Date,
        call_session_id: String,
        call_result: String,
        client_id: String,
        agent_name: String,
        disposition: String,
        total_time: Number,
	category: String,
        present_phrases: [
            {
                category: String,
                phrase: String,
                startTime: Number,
                phrasesType: String,
                is_agent: Boolean
            }
        ],

    }
);

module.exports = mongoose.model('ProcessCallsUnwindData', ProcessSchema);

