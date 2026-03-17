from models.loginSchema import validator
import json

def validate_Login(func):
  def wrapper(event, context):

    # ❌ ingen body
    if "body" not in event or not event["body"]:
      return {
        "statusCode": 400,
        "body": json.dumps({
          "status": "error",
          "message": "Missing request body"
        })
      }

    data = event["body"]

    # ✅ parse JSON om string
    if isinstance(data, str):
      try:
        data = json.loads(data)
      except json.JSONDecodeError:
        return {
          "statusCode": 400,
          "body": json.dumps({
            "status": "error",
            "message": "Invalid JSON"
          })
        }

    # ✅ validera
    if not validator.validate(data):
      return {
        "statusCode": 400,
        "body": json.dumps({
          "status": "error",
          "message": "Invalid request body",
          "errors": validator.errors
        })
      }

    # 🔥 VIKTIGT (detta saknades)
    event["validated_body"] = data

    # (valfritt men bra)
    event["body"] = data

    return func(event, context)

  return wrapper