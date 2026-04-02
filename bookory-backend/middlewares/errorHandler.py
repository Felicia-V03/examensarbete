from responses.index import send_response

# Middleware to handle errors in functions
def error_handler(func):
  # Wrapper function to catch errors and return a response
  def wrapper(*args, **kwargs):
    try:
      return func(*args, **kwargs)
    except Exception as error:
      print(error)
      return send_response(400, {
        "message": str(error)
      })
  return wrapper