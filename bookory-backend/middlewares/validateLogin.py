from models.loginSchema import validator

def validate_Login(func):
  def wrapper(handler):
    if "body" not in handler or not handler["body"]:
      return {"status": "error", "message": "Missing request body"}, 400
    
    data = handler["body"]

    if not validator.validate(data):
      return {"status": "error", "message": "Invalid request body", "errors": validator.errors}, 400
    
    return func(handler)
  return wrapper
