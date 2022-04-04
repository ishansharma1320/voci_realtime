# import urlparse
from urllib.parse import urlparse
# import httplib
import http.client as httplib
import json
from datetime import datetime, date
import sys
dt=datetime.fromtimestamp(1635140783).isoformat()
print(dt)
transcript = [
    {
     "order": "ca",
     "Customer": {
         "start_time":60.56,
         "end_time":62.45,
         "text":"Hello, is it first national bank?"
         }, 
     "Agent": 
         {
        "start_time":63.15,
        "end_time":64.50,
         "text":"Hi, My name is Bob, How can i help you?"
         }
     },
    {
     "order": "ca",
     "Customer": {
         "start_time":65.05,
         "end_time":68.10,
         "text":"I am trying to do a payment using your credit card but somehow it's not being processed properly. The amount has deducted, however the transaction has failed on the XYZ website."
         }, 
     "Agent": 
         {
        "start_time":68.20,
        "end_time":69.10,
         "text": "Please wait till I get your recent transactions."
         }
     },
    {
     "order": "ca",
     "Customer": {
         "start_time":69.20,
         "end_time":69.35,
         "text":"Sure, I'll wait"
         }, 
     "Agent": 
         {
        "start_time":69.40,
        "end_time":69.50,
         "text": "Thank you."
         }
     },
    {
     "order": "ac",
     "Customer": {
         "start_time":72.25,
         "end_time":73.50,
         "text":"Yes, that's the one, I wanted to know, when can I expect the money to be credited back?"
         }, 
     "Agent": 
         {
        "start_time":70.00,
        "end_time":72.15,
         "text": "Thank you for waiting, I am able to see that you attempted a transaction on XYZ Co. Ltd. on Tuesday, 22nd March, 4:41 PM. Is this the transaction you are mentioning?"
         }
     },
    {
     "order": "ac",
     "Customer": {
         "start_time":74.55,
         "end_time":75.10,
         "text":"Thanks, that's all I wanted to know."
         }, 
     "Agent": 
         {
        "start_time":74.00,
        "end_time":75.45,
         "text": "It usually depends on the vendor, but on an average, you should see the amount credited in your account within 2-3 business days."
         }
     },
        {
         "order": "ac",
         "Customer": {
             "start_time":76.54,
             "end_time":77.23,
             "text":"Nope, I have my doubt resolved, thanks"
             }, 
         "Agent": 
             {
            "start_time":75.58,
            "end_time":76.42,
             "text": "Is there anything else that I can help you with today?"
             }
         },
    {
     "order": "ac",
     "Customer": {
         "start_time":78.12,
         "end_time":78.36,
         "text":"Thanks, same to you."
         }, 
     "Agent": 
         {
        "start_time":77.02,
        "end_time":77.58,
         "text": "Great, thank you for your time and have a nice day."
         }
     }
    
    
    ]


    
example_content={
  'emotion': 'Neutral',
  'X-STT-ID': '6a56e6cfa3d3bf694be4dd0931bf8443@0.0.0.0',
  'gender': "",
  'agentId': '3868807',
  'localparty': '+18554344553',
  'contact_number': '+18554344554',
  'sentiment': "",
  'speaker': 'Customer',
  'text': 'Thank you for calling first National bank. rrrrrrrrrrrrrrrrrr' ,
  'utterance': 'Thank you for calling first National bank.',
  'hostName': 'localhost.localdomain',
  'direction': 'in',
  'NativeCallId': '9ff04ca-1429d554-4067d-7f5d5696e990-140224ac-13b2-759',
  'messageStartTime': 63.18,
  'ucid': 'Vi',
  'messageEndTime': 67.86,
  'engagementStartTime': '1566591967',
  'streamStartTime': dt,
  'type': 'utterance',
  'remoteparty': '3333333327799', #'+14125521507',
  'completed' : False,
  'isFinal' : True,
  "call_metadata": "{'call_campaign_id': '1137598', 'ondemand': 'false', 'agent_first_agent': '3868807', 'call_language': 'en-US', 'nativecallid': '132369-2320', 'omni_total_body_chars_size': '0', 'localentrypoint': '7252297735', 'full_name': 'Yogesh+Kale', 'duration': '577', 'campaign_name': 'YacTraq_VoiceStream+-+725-229-7735', 'hipercalltype': 'out', 'call_wrapup_time': '0', 'remoteparty': '6045312222', 'call_number': '6045312222', 'captureport': 'AABA', 'service': 'orkaudio-ip-10-20-4-29.us-east-2.compute.internal', 'omni_email_priority': '0', 'hostname': 'ip-10-20-4-29.us-east-2.compute.internal', 'call_start_timestamp': '2022-03-30+18%pk17%pk59.945', 'filename': '2022/03/30/18/20220330_181809_AABA.wav', 'live': 'true', 'call_bill_time': '30000', 'Device': '3123253', 'rec': 'true', 'type': 'tape', 'ctimetadata': 'true', 'direction': 'in', 'omni_total_body_bytes_size': '0', 'localparty': '3868807', 'tags': 'Device:3123253,agent_first_agent:3868807,agent_id:3868807,agent_station_type:SOFTPHONE,call_bill_time:30000,call_campaign_id:1137598,call_handle_time:1,call_hold_time:0,call_language:en-US,call_length:6262,call_mediatype:voice,call_number:6045312222,call_park_time:0,call_queue_time:1408,call_session_id:539E4662B7474303819DFC4E1BC47D3D,call_start_timestamp:2022-03-30+18%pk17%pk59.945,call_type:2,call_wrapup_time:0,campaign_name:YacTraq_VoiceStream+-+725-229-7735,ctimetadata:true,full_name:Yogesh+Kale,hipercalltype:out,ivr_error_code:0000000000000000000,ivr_error_desc:No+error,ivr_last_module:SkillTransfer4,omni_email_priority:0,omni_total_body_bytes_size:0,omni_total_body_chars_size:0,rec:true,skill_name:YacTraq_Skill,user_name:yogesh.kale@medallia.partner', 'timestamp': '1648664289', 'call_session_id': '539E4662B7474303819DFC4E1BC47D3D', 'remoteip': '147.124.191.17', 'ivr_error_code': '0000000000000000000', 'call_queue_time': '1408', 'call_type': '2', 'stage': 'stop', 'agent_station_type': 'SOFTPHONE', 'call_length': '6262', 'ivr_last_module': 'SkillTransfer4', 'user_name': 'yogesh.kale@medallia.partner', 'call_handle_time': '1', 'localip': '', 'recid': '20220330_181809_AABA', 'skill_name': 'YacTraq_Skill', 'call_park_time': '0', 'call_hold_time': '0', 'call_mediatype': 'voice', 'ivr_error_desc': 'No+error', 'side': 'both', 'agent_id': '3868807'}"
}
example_content2={
  'emotion': 'Neutral',
  'X-STT-ID': '6a56e6cfa3d3bf694be4dd0931bf8443@0.0.0.0',
  'gender': "",
  'localparty': '+18554344553',
  'contact_number': '+18554344554',
  'sentiment': "",
  'speaker': 'Agent',
  'text': 'Your Welcome' ,
  'utterance': 'Your Welcome',
  'hostName': 'localhost.localdomain',
  'direction': 'in',
  'NativeCallId': '9ff04ca-1429d554-4067d-7f5d5696e990-140224ac-13b2-759',
  'messageStartTime': 67.86,
  'ucid': 'Vi',
  'messageEndTime': 70.86,
  'engagementStartTime': '1566591967',
  'streamStartTime': dt,
  'type': 'utterance',
  'remoteparty': '3333333327799', #'+14125521507',
  'completed' : False,
  'isFinal' : True
}

def send(url, apiToken, content):
    pUrl = urlparse(url)
    headers = {'Content-Type': 'application/json', 'X-API-Token': apiToken}
    conn = httplib.HTTPConnection(pUrl.netloc)  # use HTTPConnection if pUrl.scheme=='http'
    conn.request('POST', pUrl.path, json.dumps(content), headers)
    resp = conn.getresponse()
    if resp.status != 200: print('Something went wrong')

# send('http://13.127.219.224:3003/transcriptstream', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiY29udGFxdCI', example_content2)

# def processSampleScript(script):
  
if __name__ == '__main__':
  # processSampleScript(transcript)
  if len(sys.argv)>1 and sys.argv[1] == "stop":
    example_content['type'] = "stop"
    send('http://127.0.0.1:3003/transcriptstream', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiY29udGFxdCI', example_content)
  else:
    d = []
    for i in range(len(transcript)):
      sc = transcript[i]
      # print(sc)
      order = sc.get('order','')
      if order == 'ca':
        cus_content = example_content.copy()
        cus_content['speaker'] = "Customer"
        customerObj = sc.get("Customer",{})
        cus_content['text'] = customerObj.get('text','')
        cus_content['utterance'] = customerObj.get('text','')
        cus_content['messageStartTime'] = customerObj.get('start_time',0.00)
        cus_content['messageEndTime'] = customerObj.get('end_time',1.00)
        cus_content['isFinal'] = False
        print(cus_content)
        d.append({"native": example_content,"generated": cus_content})
        send('http://127.0.0.1:3003/transcriptstream', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiY29udGFxdCI', cus_content)
        agt_content = example_content.copy()
        agt_content['speaker'] = "Agent"
        agentObj = sc.get("Agent",{})
        agt_content['text'] = agentObj.get('text','')
        agt_content['utterance'] = agentObj.get('text','')
        agt_content['messageStartTime'] = agentObj.get('start_time',0.00)
        agt_content['messageEndTime'] = agentObj.get('end_time',1.00)
        if i == len(transcript)-1:
          agt_content['isFinal'] = True
          # agt_content['type'] = "stop"
        else:
          agt_content['isFinal'] = False
        d.append({"native": example_content,"generated": agt_content})
        send('http://127.0.0.1:3003/transcriptstream', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiY29udGFxdCI', agt_content)
      elif order == 'ac':
        agt_content = example_content.copy()
        agt_content['speaker'] = "Agent"
        agentObj = sc.get("Agent",{})
        agt_content['text'] = agentObj.get('text','')
        agt_content['utterance'] = agentObj.get('text','')
        agt_content['messageStartTime'] = agentObj.get('start_time',0.00)
        agt_content['messageEndTime'] = agentObj.get('end_time',1.00)
        d.append({"native": example_content,"generated": agt_content})
        send('http://127.0.0.1:3003/transcriptstream', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiY29udGFxdCI', agt_content)
        cus_content = example_content.copy()
        cus_content['speaker'] = "Customer"
        customerObj = sc.get("Customer",{})
        cus_content['text'] = customerObj.get('text','')
        cus_content['utterance'] = customerObj.get('text','')
        cus_content['messageStartTime'] = customerObj.get('start_time',0.00)
        cus_content['messageEndTime'] = customerObj.get('end_time',1.00)
        if i == len(transcript)-1:
          cus_content['isFinal'] = True
          # cus_content['type']= "stop"
        else:
          cus_content['isFinal'] = False
        d.append({"native": example_content,"generated": cus_content})
        send('http://127.0.0.1:3003/transcriptstream', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiY29udGFxdCI', cus_content)
  