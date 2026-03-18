from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.validateLogin import validate_login
from services.users import get_user
from utils.jwt import generate_token

@error_handler
@validate_login

def handler(event, context):
  body = event["validated_body"]

  user = get_user(body["email"])

  if user:
    db_password = user["attributes"]["password"]
    db_email = user["attributes"]["email"]
    db_userid = user["attributes"]["userid"]

    if body["password"] == db_password:
      token = generate_token({
        "email": db_email,
        "userid": db_userid
      })

      return send_response(200, {
        "message": "Login successful",
        "user": {
          "userid": db_userid,
          "email": db_email
        },
        "token": token
      })

    return send_response(401, {
      "message": "Invalid email or password"
    })

  return send_response(404, {
    "message": "User not found"
  })