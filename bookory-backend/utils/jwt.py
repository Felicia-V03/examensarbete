import jwt
from datetime import datetime, timedelta

SECRET = "bookory_secret_key"

def generateToken(user):
  payload = {
    "user_id": user.id
  }
  return jwt.encode(payload, SECRET, { "expires_in": timedelta(hours=2) })

def verifyToken(token):
  try:
    decoded = jwt.decode(token, SECRET)
    return decoded
  except jwt.ExpiredSignatureError:
    print("Token has expired")
    return None
  except jwt.InvalidTokenError:
    print("Invalid token:", token)
    return None