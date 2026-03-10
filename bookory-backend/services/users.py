from utils.bcrypt import hashPassword, verifyPassword
from client import table

def createUser(user):
  print("Creating user...", user)

  try:
    table.put_item(
      Item = {
        "PK" : {"S": "USER#${user.username}"},
        "SK" : {"S": "PROFILE"},
        "attributes" : {
          "M": {
            "username": {"S": user.username},
            "email": {"S": user.email},
            "password": {"S": hashPassword(user.password)},
          }
        }
      }
    )
    return {"message": "User created successfully"}
  
  except Exception as error:
    print("Error creating user:", error)
    return {"message": "Error creating user"}
  
def getUser(username):
  print("Getting user...", username)

  try:
    response = table.get_item(
      Key = {
        "PK": {"S": f"USER#{username}"},
        "SK": {"S": "PROFILE"}
      }
    )
    return response.get("message", "user found")
  
  except Exception as error:
    print("Error getting user:", error)
    return {"message": "Error getting user"}