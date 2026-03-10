from utils.jwt import verifyToken

def authenticateUser(func):
  def wrapper(event, *args, **kwargs):
    headers = event.get("headers", {})

    autHeader = headers.get("Authorization") or headers.get("authorization")

    if not autHeader:
      return {
        "statusCode": 401,
        "body": "Unauthorized: No token provided"
      }
    
    token = autHeader.split(" ")[1]

    user = verifyToken(token)

    if not user:
      return {
        "statusCode": 401,
        "body": "Unauthorized: Invalid token"
      }
    
    event["user"] = user

    return func(event, *args, **kwargs)
  return wrapper