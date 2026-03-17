from services.client import table
from utils.uuid import generate_uuid
from datetime import datetime
# from utils.bcrypt import hash_password

def create_User(user):
  print("Creating user...", user)

  user_id = generate_uuid(8)
  created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

  try:
    table.put_item(
      Item={
        "PK": f"USER#{user_id}",
        "SK": "PROFILE",
        "attributes": {
          "userid": user_id,
          "username": user["username"],
          "email": user["email"],
          "password": user["password"],
          "createdat": created_at
        }
        
      }
    )

    return {
      "message": "User created successfully",
      "userid": user_id,
    }

  except Exception as error:
    print("Error creating user:", error)
    return False

def get_User(email):
  try:
    response = table.scan()
    items = response.get("Items", [])

    for item in items:
      if "attributes" in item:
        attributes = item.get("attributes", {})
        if isinstance(attributes, dict):
          db_email = attributes.get("email")

          if db_email == email:
            return item

    return None

  except Exception as error:
    print("Error getting user:", error)
    return None