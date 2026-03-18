from responses.index import send_response

def error_handler(func):
  def wrapper(*args, **kwargs):
    try:
      return func(*args, **kwargs)
    except Exception as error:
      print(error)
      return send_response(400, {
        "message": str(error)
      })
  return wrapper