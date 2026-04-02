from utils.jwt import verify_token

# Middleware to authenticate user using JWT token in Authorization header
def authenticate_user(func):
  # Wrapper function to handle authentication
  def wrapper(event, *args, **kwargs):
    headers = event.get("headers", {})

    # Get token from Authorization header
    autHeader = headers.get("Authorization") or headers.get("authorization")

    # Validate token
    if not autHeader:
      return {
        "statusCode": 401,
        "body": "Unauthorized: No token provided"
      }
    
    # Extract token (assuming format "Bearer <token>")
    token = autHeader.split(" ", 1)[1]

    # Verify token and get user info
    user = verify_token(token)

    # If token is invalid, return 401
    if not user:
      return {
        "statusCode": 401,
        "body": "Unauthorized: Invalid token"
      }
    
    # Add user info to event
    event["user"] = user

    # Call the original function with the modified event
    return func(event, *args, **kwargs)
  return wrapper