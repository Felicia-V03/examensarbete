from services.client import table
from utils.uuid import generate_uuid
from datetime import datetime
# from utils.bcrypt import hash_password

# create user function, used in RegisterUser/index.py
def create_user(user):
  print("Creating user...", user)

  # Generate a unique user ID and get the current timestamp for createdAt
  user_id = generate_uuid(8)
  created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

  # user data should include username, email, password
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

    # Return the created user id
    return {
      "message": "User created successfully",
      "userid": user_id,
    }

  # If there's an error (e.g. email already exists), log it and return False
  except Exception as error:
    print("Error creating user:", error)
    return False

# get user by email function, used in LoginUser/index.py
def get_user(email):
  try:
    response = table.scan()
    items = response.get("Items", [])

    # Loop through items to find the user with the matching email
    for item in items:
      if "attributes" in item:
        attributes = item.get("attributes", {})
        if isinstance(attributes, dict):
          db_email = attributes.get("email")

          # If the email matches, return the user item
          if db_email == email:
            return item
          
    # If no user is found with the given email, return None
    return None

  # If there's an error scanning the table, log it and return None
  except Exception as error:
    print("Error getting user:", error)
    return None