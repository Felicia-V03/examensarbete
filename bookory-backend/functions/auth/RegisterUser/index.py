from responses import send_Response
from middlewares.errorHandler import error_Handler
from middlewares.validateUser import validate_User
from services.users import create_User

@error_Handler
@validate_User

def handler(event):
  body = event["body"]

  response = create_User(body)

  if response:
    print("User created successfully", body["username"])
    return send_Response(201, {
      "message": "User created successfully",
      "user": {
        "username": body["username"],
        "email": body["email"]
      }
    })
  else:
    print("Error creating user", body["username"])
    return send_Response(400, {
      "message": "Error creating user",
      "user": {
        "username": body["username"],
        "email": body["email"]
      }
    })