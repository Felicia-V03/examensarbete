from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.authenticateUser import authenticate_user
from middlewares.validateBook import validate_book
from services.books import add_book

@error_handler
@authenticate_user
@validate_book

def handler(event, context):
  # Get validated body and user from event
  body = event["validated_body"]
  # Get user id from authenticated user
  user = event["user"]
  userid = user["userid"]

  # Add book
  result = add_book(userid, body)

  # Return response
  if result:
    return send_response(201, result)
  # If book not created, return 500
  else:
    return send_response(500, {"message": "Error creating book"})