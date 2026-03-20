from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.authenticateUser import authenticate_user
from middlewares.validateBook import validate_book
from services.books import update_book_by_id

@error_handler
@authenticate_user
@validate_book

def handler(event, context):
  # Get book id from path parameters
  path = event.get("pathParameters") or {}
  book_id = path.get("id")
  # Validate book info in body
  body = event["validated_body"]
  # Get user id from authenticated user
  user = event["user"]
  userid = user["userid"]

  # Update book by id
  result = update_book_by_id(userid, book_id, body)

  # Return response
  if result:
    return send_response(200, result)
  # If book not found, return 404
  else:
    return send_response(500, {"message": "Error updating book"})