from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.authenticateUser import authenticate_user
from middlewares.validateBook import validate_book
from services.books import add_book
import json

@error_handler
@authenticate_user
@validate_book

def handler(event, context):
  body = event["validated_body"]
  user = event["user"]
  userid = user["userid"]
  
  result = add_book(userid, body)

  if result:
    return {
      "statusCode": 201,
      "body": json.dumps(result)
    }
  else:
    return {
      "statusCode": 500,
      "body": json.dumps({"message": "Error creating book"})
    }