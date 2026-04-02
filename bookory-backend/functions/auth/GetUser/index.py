from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.authenticateUser import authenticate_user
from services.users import get_user

@error_handler
@authenticate_user

def handler(event, context):
  # Get the authenticated user's email from the event (set by the authenticate_user middleware)
  user = event.get("user")
  if not user:
    return send_response(401, {"message": "Unauthorized"})

  user_email = user.get("email")

  # Fetch the user data from the database using the email
  user_data = get_user(user_email)

  if user_data:
    # Return the user data (excluding sensitive information like password)
    attributes = user_data.get("attributes", {})
    return send_response(200, {
      "message": "User data retrieved successfully",
      "user": {
        "username": attributes.get("username"),
        "email": attributes.get("email"),
        "phone": attributes.get("phone"),
        "address": attributes.get("address"),
        "createdat": attributes.get("createdat")
      }
    })
  else:
    return send_response(404, {"message": "User not found"})