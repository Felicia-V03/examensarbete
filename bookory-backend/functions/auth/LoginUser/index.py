from responses import send_Response
from middlewares.errorHandler import error_Handler
from middlewares.validateLogin import validate_Login
from services.users import get_User
from utils.bcrypt import verify_Password
from utils.jwt import generate_Token

@error_Handler
@validate_Login

def handler(event):
  body = event["body"]

  response = get_User(body["username"])

  if response:
    if verify_Password(body["password"], response["attributes"]["password"]["S"].encode('utf-8')):
      token = generate_Token(response["attributes"]["username"]["S"])
      print("Login successful", body["username"])
      return send_Response(200, {
        "message": "Login successful",
        "token": token
      })
    else:
      print("Invalid username orpassword", body["username"])
      return send_Response(401, {
        "message": "Invalid username or password"
      })
  else:
    print("User not found", body["username"])
    return send_Response(404, {
      "message": "User not found"
    })