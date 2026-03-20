from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.authenticateUser import authenticate_user
from services.books import delete_book_by_id

@error_handler
@authenticate_user

def handler(event, context):
  path = event.get("pathParameters") or {}
  book_id = path.get("id")
  user = event["user"]
  userid = user["userid"]

  if not book_id:
    return send_response(400, {"message": "Missing book id"})
  
  result = delete_book_by_id(userid, book_id)

  if result:
    return send_response(200, result)
  else:
    return send_response(500, {"message": "Error deleting book"})