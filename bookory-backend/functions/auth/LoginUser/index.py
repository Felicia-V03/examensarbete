# from responses.index import send_Response
# from middlewares.errorHandler import error_Handler
# from middlewares.validateLogin import validate_Login
# from services.users import get_User
# from utils.bcrypt import verify_Password
# from utils.jwt import generate_Token

# @error_Handler
# @validate_Login

# def handler(event):
#   body = event["body"]

#   response = get_User(body["email"])

#   if response:
#     if verify_Password(body["password"], response["attributes"]["password"]["S"].encode('utf-8')):
#       token = generate_Token(response["attributes"]["email"]["S"])
#       print("Login successful", body["email"])
#       return send_Response(200, {
#         "message": "Login successful",
#         "token": token
#       })
#     else:
#       print("Invalid email or password", body["email"])
#       return send_Response(401, {
#         "message": "Invalid email or password"
#       })
#   else:
#     print("User not found", body["email"])
#     return send_Response(404, {
#       "message": "User not found"
#     })