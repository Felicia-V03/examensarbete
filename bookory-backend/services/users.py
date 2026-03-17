# from utils.bcrypt import hash_Password
from services.client import table
from utils.uuid import generate_uuid
from datetime import datetime

def create_User(user):
  print("Creating user...", user)

  user_id = generate_uuid(8)
  created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

  try:
    table.put_item(
      Item = {
        "PK" : {"S": f"USER#{user_id}"},
        "SK" : {"S": "PROFILE"},
        "attributes" : {
          "M": {
            "userid": {"S": user_id},
            "username": {"S": user.username},
            "email": {"S": user.email},
            "password": {"S": user.password},
            "createdat": {"S": created_at}
          }
        }
      }
    )
    return {
      "message": "User created successfully",
      "userid": user_id,
      "createdat": created_at
    }
  
  except Exception as error:
    print("Error creating user:", error)
    return {"message": "Error creating user"}
  
def get_User(user_id):
  print("Getting user...", user_id)

  try:
    response = table.get_item(
      Key = {
        "PK": {"S": f"USER#{user_id}"},
        "SK": {"S": "PROFILE"}
      }
    )
    return response.get("message", "user found")
  
  except Exception as error:
    print("Error getting user:", error)
    return {"message": "Error getting user"}