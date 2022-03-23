'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.ObjectId;

var ProcessSchema = new mongoose.Schema(
    {
        call_id: String,
        account_id: String,
	agent_id: String,
        contact_phone_number: String,
        start_at: Date,
        call_session_id: String,
	call_result: String,
        agent_result: String,
        campaign_filename: String,
        client_id: String,
        agent_name: String,
        disposition: String,
	total_time: Number,
        transcript: [
            {
                speaker: String,
                utterance: String,
                startTime: Number,
                is_agent: Boolean
            }
        ],
        present_phrases: [
            {
                category: String,
                phrase: String,
                startTime: Number,
		phrasesType: String,
		is_agent: Boolean
            }
        ],
	deviation: {
            startTime : Number,
            percentage : Number
        }
    }
);

module.exports = mongoose.model('ProcessedCall', ProcessSchema);

