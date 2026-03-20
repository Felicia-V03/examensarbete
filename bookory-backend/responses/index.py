import json

# function to send response
def send_response (code, data):
  return {
    "statusCode": code,
    "body": json.dumps(data)
  }