import jwt
from datetime import datetime, timedelta

SECRET = "bookory_secret_key"

def generate_token(user):
  now = datetime.utcnow()
  exp = now + timedelta(hours=2)
  payload = {
    "email": user.get("email") or user.get("user_id"),
    "userid": user.get("userid") or user.get("user_id"),
    "exp": int(exp.timestamp())
  }
  return jwt.encode(payload, SECRET, algorithm="HS256")

def verify_token(token):
  try:
    decoded = jwt.decode(token, SECRET, algorithms=["HS256"])
    return decoded
  except jwt.ExpiredSignatureError:
    print("Token has expired")
    return None
  except jwt.InvalidTokenError:
    print("Invalid token:", token)
    return None