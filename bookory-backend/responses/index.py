import json

def sendResponse (code, data):
  return {
    "statusCode": code,
    "body": json.dumps(data)
  }