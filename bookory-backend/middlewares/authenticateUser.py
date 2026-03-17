from utils.jwt import verify_Token

def authenticate_User(func):
  def wrapper(event, *args, **kwargs):
    headers = event.get("headers", {})

    autHeader = headers.get("Authorization") or headers.get("authorization")

    if not autHeader:
      return {
        "statusCode": 401,
        "body": "Unauthorized: No token provided"
      }
    
    token = autHeader.split(" ")[1]

    user = verify_Token(token)

    if not user:
      return {
        "statusCode": 401,
        "body": "Unauthorized: Invalid token"
      }
    
    event["user"] = user

    return func(event, *args, **kwargs)
  return wrapper