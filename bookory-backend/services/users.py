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
          "address": "null",
          "phone": "null",
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
  
def put_user(user_id, data):
  try:
    update_expression = "SET"
    expression_values = {}
    expression_names = {}

    if "email" in data:
      update_expression += " attributes.#email = :email,"
      expression_values[":email"] = data["email"]
      expression_names["#email"] = "email"

    if "phone" in data:
      update_expression += " attributes.#phone = :phone,"
      expression_values[":phone"] = data["phone"]
      expression_names["#phone"] = "phone"

    if "address" in data:
      update_expression += " attributes.#address = :address,"
      expression_values[":address"] = data["address"]
      expression_names["#address"] = "address"

    update_expression = update_expression.rstrip(",")

    if update_expression == "SET":
      return {"message": "Nothing to update"}

    response = table.update_item(
      Key={
        "PK": f"USER#{user_id}",
        "SK": "PROFILE"
      },
      UpdateExpression=update_expression,
      ExpressionAttributeValues=expression_values,
      ExpressionAttributeNames=expression_names,
      ReturnValues="UPDATED_NEW"
    )

    return {
      "message": "User updated successfully",
      "updated": response.get("Attributes", {})
    }

  except Exception as error:
    print("Error updating user:", error)
    return False