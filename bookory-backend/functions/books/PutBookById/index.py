from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.authenticateUser import authenticate_user
from middlewares.validateBook import validate_book
from services.books import update_book_by_id

@error_handler
@authenticate_user
@validate_book

def handler(event, context):
  path = event.get("pathParameters") or {}
  book_id = path.get("id")
  body = event["validated_body"]
  user = event["user"]
  userid = user["userid"]

  result = update_book_by_id(userid, book_id, body)

  if result:
    return send_response(200, result)
  else:
    return send_response(500, {"message": "Error updating book"})