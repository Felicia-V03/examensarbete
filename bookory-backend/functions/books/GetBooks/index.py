from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.authenticateUser import authenticate_user
from services.books import get_books

@error_handler
@authenticate_user

def handler(event, context):
  user = event["user"]
  userid = user["userid"]

  result = get_books(userid)

  if result:
    return send_response(200, result)
  else:
    return send_response(500, {"message": "Error fetching books"})