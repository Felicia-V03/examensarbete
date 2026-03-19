from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.authenticateUser import authenticate_user
from services.books import get_book_by_status

@error_handler
@authenticate_user

def handler(event, context):
  path = event.get("pathParameters") or {}
  user = event["user"]
  userid = user["userid"]
  status = path.get("status")

  if not status:
    return send_response(400, {"message": "Missing status"})

  result = get_book_by_status(userid, status)

  if result:
    return send_response(200, result)
  else:
    return send_response(404, {"message": "Book not found", "status": status})