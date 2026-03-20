from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.authenticateUser import authenticate_user
from services.books import get_books

@error_handler
@authenticate_user

def handler(event, context):
  # Get user id from authenticated user
  user = event["user"]
  userid = user["userid"]

  # Get books for user
  result = get_books(userid)

  # Return response
  if result:
    return send_response(200, result)
  # If no books found, return 404
  else:
    return send_response(500, {"message": "Error fetching books"})