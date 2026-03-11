from utils.bcrypt import hash_Password
from client import table

def create_User(user):
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
            "password": {"S": hash_Password(user.password)},
          }
        }
      }
    )
    return {"message": "User created successfully"}
  
  except Exception as error:
    print("Error creating user:", error)
    return {"message": "Error creating user"}
  
def get_User(username):
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