import json
from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.validateUser import validate_user
from services.users import create_user

@error_handler
@validate_user

def handler(event, context):
  body = event["body"]

  if isinstance(body, str):
    body = json.loads(body)

  print("Creating user...", body["username"])

  response = create_user(body)

  if response:
    print("User created successfully", body["username"])
    return send_response(201, {
      "message": "User created successfully",
      "user": {
        "username": body["username"],
        "email": body["email"]
      }
    })
  else:
    print("Error creating user", body["username"])
    return send_response(400, {
      "message": "Error creating user",
      "user": {
        "username": body["username"],
        "email": body["email"]
      }
    })