from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.authenticateUser import authenticate_user
from middlewares.validateBook import validate_book
from services.books import add_book

@error_handler
@authenticate_user
@validate_book

def handler(event, context):
  body = event["validated_body"]
  user = event["user"]
  userid = user["userid"]

  result = add_book(userid, body)

  if result:
    return send_response(201, result)
  else:
    return send_response(500, {"message": "Error creating book"})