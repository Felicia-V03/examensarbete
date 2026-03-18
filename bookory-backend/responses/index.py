import json

def send_response (code, data):
  return {
    "statusCode": code,
    "body": json.dumps(data)
  }