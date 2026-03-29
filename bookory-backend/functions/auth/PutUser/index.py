from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.authenticateUser import authenticate_user
from middlewares.validateUpdateUser import validate_update
from services.users import get_user, put_user

@error_handler
@authenticate_user
@validate_update

def handler(event, context):
  body = event["validated_body"]
  user = get_user(body["email"])

  userid = user["attributes"]["userid"]

  response = put_user(userid, body)

  if response:
    return send_response(200, {
      "message": "User updated successfully",
      "updated": response.get("updated", {})
    })
  else:
    return send_response(400, {
      "message": "Error updating user"
    })