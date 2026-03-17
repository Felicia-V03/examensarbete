from models.userSchema import user_Schema, validator
import json

def validate_User(func):
  def wrapper(event, context):
    if "body" not in event or not event["body"]:
      return {"statusCode": 400, "body": json.dumps({"status": "error", "message": "Missing request body"})}
    
    data = event["body"]
    
    # Parse JSON string if needed
    if isinstance(data, str):
      try:
        data = json.loads(data)
      except json.JSONDecodeError:
        return {"statusCode": 400, "body": json.dumps({"status": "error", "message": "Invalid JSON"})}

    if not validator.validate(data):
      return {"statusCode": 400, "body": json.dumps({"status": "error", "message": "Invalid request body", "errors": validator.errors})}
    
    return func(event, context)
  return wrapper