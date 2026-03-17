from models.loginSchema import validator
import json

def validate_Login(func):
  def wrapper(event, context):
    if "body" not in event or not event["body"]:
      return {"status": "error", "message": "Missing request body"}, 400
    
    data = event["body"]

    if not validator.validate(data):
      return {"status": "error", "message": "Invalid request body", "errors": validator.errors}, 400
    
    return func(event, context)
  return wrapper
