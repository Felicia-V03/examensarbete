from responses.index import send_response
from middlewares.errorHandler import error_handler
from middlewares.authenticateUser import authenticate_user
from services.books import get_book_by_status

@error_handler
@authenticate_user

def handler(event, context):
  # Get status from path parameters
  path = event.get("pathParameters") or {}
  status = path.get("status")
  # Get user id from authenticated user
  user = event["user"]
  userid = user["userid"]
  
  # Validate status
  if not status:
    return send_response(400, {"message": "Missing status"})

  # Get book by status
  result = get_book_by_status(userid, status)

  # Return response
  if result:
    return send_response(200, result)
  # If book not found, return 404
  else:
    return send_response(404, {"message": "Book not found", "status": status})