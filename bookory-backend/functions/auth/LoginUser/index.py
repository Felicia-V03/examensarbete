from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.validateLogin import validate_login
from services.users import get_user
from utils.jwt import generate_token

@error_handler
@validate_login

def handler(event, context):
  body = event["validated_body"]

  # Get user by email
  user = get_user(body["email"])

  if user:
    # Get user attributes
    db_password = user["attributes"]["password"]
    db_email = user["attributes"]["email"]
    db_userid = user["attributes"]["userid"]

    # Check if password matches
    if body["password"] == db_password:
      # Generate JWT token with user email and userid
      token = generate_token({
        "email": db_email,
        "userid": db_userid
      })

      # Return user info and token
      return send_response(200, {
        "message": "Login successful",
        "user": {
          "userid": db_userid,
          "email": db_email
        },
        "token": token
      })

    # Password does not match
    return send_response(401, {
      "message": "Invalid email or password"
    })

  # User not found
  return send_response(404, {
    "message": "User not found"
  })