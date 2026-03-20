from models.loginSchema import validator
import json

def validate_login(func):
  def wrapper(event, context):

    # check if body exists
    if "body" not in event or not event["body"]:
      return {
        "statusCode": 400,
        "body": json.dumps({
          "status": "error",
          "message": "Missing request body"
        })
      }

    # login data is in body
    data = event["body"]

    # if body is a string, try to parse it as JSON
    if isinstance(data, str):
      # if body is not valid JSON, return error response
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

    # validate data against schema
    if not validator.validate(data):
      return {
        "statusCode": 400,
        "body": json.dumps({
          "status": "error",
          "message": "Invalid request body",
          "errors": validator.errors
        })
      }

    # if validation passed, add validated data to event and call the function
    event["validated_body"] = data

    return func(event, context)

  return wrapper