from responses import send_Response

def error_Handler(func):
  def wrapper(*args, **kwargs):
    try:
      return func(*args, **kwargs)
    except Exception as error:
      print(error)
      return send_Response(400, {
        "message": str(error)
      })
  return wrapper