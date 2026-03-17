import json

def send_Response (code, data):
  return {
    "statusCode": code,
    "body": json.dumps(data)
  }