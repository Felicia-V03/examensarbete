from responses import sendResponse

def errorHandler(func):
  def wrapper(*args, **kwargs):
    try:
      return func(*args, **kwargs)
    except Exception as error:
      print(error)
      return sendResponse(400, {
        "message": str(error)
      })
  return wrapper