from models.bookSchema import validator
import json

def validate_book(func):
  def wrapper(event, context):

    # 1. Kolla body
    if "body" not in event or not event["body"]:
      return {
        "statusCode": 400,
        "body": json.dumps({
          "message": "Missing request body"
        })
      }

    data = event["body"]

    # 2. Om body är string → parse
    if isinstance(data, str):
      try:
        data = json.loads(data)
      except json.JSONDecodeError:
        return {
          "statusCode": 400,
          "body": json.dumps({
            "message": "Invalid JSON"
          })
        }

    # 3. Validera med Cerberus
    if not validator.validate(data):
      return {
        "statusCode": 400,
        "body": json.dumps({
          "message": "Invalid request body",
          "errors": validator.errors
        })
      }

    # 4. Spara validerad data (VIKTIGT)
    event["validated_body"] = data

    return func(event, context)

  return wrapper