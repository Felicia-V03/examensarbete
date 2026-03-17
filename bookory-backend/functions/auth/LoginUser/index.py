from responses.index import send_Response
from middlewares.errorHandler import error_Handler
from middlewares.validateLogin import validate_Login
from services.users import get_User
from utils.jwt import generate_Token

@error_Handler
@validate_Login

def handler(event, context):
  body = event["validated_body"]

  user = get_User(body["email"])

  if user:
    db_password = user["attributes"]["password"]
    db_email = user["attributes"]["email"]

    if body["password"] == db_password:
      token = generate_Token({
        "email": db_email
      })

      return send_Response(200, {
        "message": "Login successful",
        "token": token
      })

    return send_Response(401, {
      "message": "Invalid email or password"
    })

  return send_Response(404, {
    "message": "User not found"
  })