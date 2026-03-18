from utils.jwt import verify_token

def authenticate_user(func):
  def wrapper(event, *args, **kwargs):
    headers = event.get("headers", {})

    autHeader = headers.get("Authorization") or headers.get("authorization")

    if not autHeader or "" not in autHeader:
      return {
        "statusCode": 401,
        "body": "Unauthorized: No token provided"
      }
    
    token = autHeader.split(" ")[1]

    user = verify_token(token)

    if not user:
      return {
        "statusCode": 401,
        "body": "Unauthorized: Invalid token"
      }
    
    event["user"] = user

    return func(event, *args, **kwargs)
  return wrapper