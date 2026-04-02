from services.client import table
from datetime import datetime

# function to add a book to the database, used in AddBook.index.py
def add_book(user_id, book_data):
  print("Adding book...", book_data)

  # Extract bookId from open_library_id
  book_id = book_data.get("open_library_id")

  # created_at is the current date and time in the format "YYYY-MM-DD HH:MM"
  created_at = datetime.now().strftime("%Y-%m-%d %H:%M")

  # Handle notes if they exist
  notes = []
  if "notes" in book_data:
    for note in book_data["notes"]:
      notes.append({
        "note": note.get("note"),
        "page": note.get("page"),
        "color": note.get("color"),
      })

  # Build the attributes dictionary that will be stored in DynamoDB
  attributes = {
    "open_library_id": book_id,
    "status": book_data.get("status"),
    "pages": "0",
    "overall_rating": "0",
    "spice_rating": "0",
    "fluff_rating": "0",
    "tear_rating": "0",
    "humor_rating": "0",
    "notes": notes,
    "createdAt": created_at
  }

  # Try to put the item in the DynamoDB table
  try:
    table.put_item(
      Item={
        "PK": f"USER#{user_id}",
        "SK": f"BOOK#{book_id}",
        "attributes": attributes,
      }
    )

    # Return success response with bookId and createdAt
    return {
      "success": True,
      "bookId": book_id,
      "createdAt": created_at
    }

  # If there's an error, print it and return False
  except Exception as error:
    print("Error adding book:", error)
    return False

#function to get all books for a user, used in GetBooks.index.py
def get_books(user_id):
  # Query DynamoDB for all items with PK = USER#{user_id} and SK starting with BOOK#
  try:
    response = table.query(
      KeyConditionExpression="PK = :pk AND begins_with(SK, :sk_prefix)",
      ExpressionAttributeValues={
        ":pk": f"USER#{user_id}",
        ":sk_prefix": "BOOK#"
      }
    )

    # Process the response to extract book data and return it as a list of books
    items = response.get("Items", [])
    books = []

    # Loop through the items and extract book attributes
    for item in items:
      attributes = item.get("attributes", {})
      book_id = item["SK"].split("#")[1]

      book = {
        "bookId": book_id,
        "status": attributes.get("status"),
        "pages": attributes.get("pages"),
        "overall_rating": attributes.get("overall_rating"),
        "spice_rating": attributes.get("spice_rating"),
        "fluff_rating": attributes.get("fluff_rating"),
        "tear_rating": attributes.get("tear_rating"),
        "humor_rating": attributes.get("humor_rating"),
        "notes": attributes.get("notes", []),
        "createdAt": attributes.get("createdAt")
      }
      books.append(book)

    return books

  # If there's an error, print it and return an empty list
  except Exception as error:
    print("Error getting books:", error)
    return []

# function to get a book by id, used in GetBookById.index.py
def get_book_by_id(user_id, book_id):
  try:
    # Query DynamoDB for the item with PK = USER#{user_id} and SK = BOOK#{book_id}
    response = table.get_item(
      Key={
        "PK": f"USER#{user_id}",
        "SK": f"BOOK#{book_id}"
      }
    )

    # Process the response to extract book data and return it as a dictionary
    item = response.get("Item")
    if not item:
      return None

    # Extract book attributes and return them in a structured format
    attributes = item.get("attributes", {})
    book = {
      "bookId": book_id,
      "status": attributes.get("status"),
      "pages": attributes.get("pages"),
      "overall_rating": attributes.get("overall_rating"),
      "spice_rating": attributes.get("spice_rating"),
      "fluff_rating": attributes.get("fluff_rating"),
      "tear_rating": attributes.get("tear_rating"),
      "humor_rating": attributes.get("humor_rating"),
      "notes": attributes.get("notes", []),
      "createdAt": attributes.get("createdAt")
    }
    return book

  # If there's an error, print it and return None
  except Exception as error:
    print("Error getting book:", error)
    return None

# function to get books by status, used in GetBookByStatus.index.py
def get_book_by_status(user_id, status):
  # Query DynamoDB for items with PK = USER#{user_id}, SK starting with BOOK#, and status matching the provided status
  try:
    response = table.query(
      KeyConditionExpression="PK = :pk AND begins_with(SK, :sk)",
      FilterExpression="#attr.#status = :status",
      ExpressionAttributeValues={
        ":pk": f"USER#{user_id}",
        ":sk": "BOOK#",
        ":status": status
      },
      ExpressionAttributeNames={
        "#attr": "attributes",
        "#status": "status"
      }
    )

    # Process the response to extract book data and return it as a list of books
    items = response.get("Items", [])
    books = []

    # Loop through the items and extract book attributes
    for item in items:
      attributes = item.get("attributes", {})
      book_id = item["SK"].split("#")[1]

      book = {
        "bookId": book_id,
        "status": attributes.get("status"),
        "pages": attributes.get("pages"),
        "overall_rating": attributes.get("overall_rating"),
        "spice_rating": attributes.get("spice_rating"),
        "fluff_rating": attributes.get("fluff_rating"),
        "tear_rating": attributes.get("tear_rating"),
        "humor_rating": attributes.get("humor_rating"),
        "notes": attributes.get("notes", []),
        "createdAt": attributes.get("createdAt")
      }

      books.append(book)

    return books

  # If there's an error, print it and return an empty list
  except Exception as error:
    print("Error:", error)
    return []

# function to update a book by id, used in UpdateBookById.index.py
def update_book_by_id(user_id, book_id, update_data):
  # Validate that the book exists before trying to update it
  try:
    print("Incoming update_data:", update_data)

    # Handle notes if they exist in the update data
    notes = []
    if "notes" in update_data and isinstance(update_data["notes"], list):
      for note in update_data["notes"]:
        notes.append({
          "note": note.get("note"),
          "page": note.get("page"),
          "color": note.get("color"),
        })

    # Only allow certain fields to be updated
    allowed_fields = [
      "status",
      "pages",
      "overall_rating",
      "spice_rating",
      "fluff_rating",
      "tear_rating",
      "humor_rating"
    ]

    attributes = {}

    # Loop through allowed fields and add them to the attributes dictionary if they are present in the update data
    for field in allowed_fields:
      if field in update_data and update_data[field] is not None:
        attributes[field] = update_data[field]

    # If notes were provided, add them to the attributes dictionary
    if notes:
      attributes["notes"] = notes

    print("Attributes to update:", attributes)

    # If there are no valid fields to update, return an error response
    if not attributes:
      return {
        "success": False,
        "message": "No fields to update"
      }

    # Build the UpdateExpression, ExpressionAttributeValues, and ExpressionAttributeNames for the DynamoDB update_item call
    update_expression = "SET " + ", ".join(
      f"#attr.#{k} = :{k}" for k in attributes
    )
    expression_attribute_values = {
      f":{k}": v for k, v in attributes.items()
    }
    expression_attribute_names = {
      "#attr": "attributes",
      **{f"#{k}": k for k in attributes}
    }
    print("UpdateExpression:", update_expression)

    # Try to update the item in the DynamoDB table
    table.update_item(
      Key={
        "PK": f"USER#{user_id}",
        "SK": f"BOOK#{book_id}"
      },
      UpdateExpression=update_expression,
      ExpressionAttributeValues=expression_attribute_values,
      ExpressionAttributeNames=expression_attribute_names,
      ConditionExpression="attribute_exists(PK) AND attribute_exists(SK)"
    )

    # Return success response with bookId
    return {
      "success": True,
      "bookId": book_id
    }

  # If there's an error, print it and return an error response
  except Exception as e:
    print("Error updating book:", e)

    if "ConditionalCheckFailedException" in str(e):
      return {
        "success": False,
        "message": "Book not found"
      }

    return {
      "success": False,
      "message": "Something went wrong"
    }

# function to delete a book by id, used in DeleteBookById.index.py
def delete_book_by_id(user_id, book_id):
  try:
    # Validate that the book exists before trying to delete it
    existing_book = get_book_by_id(user_id, book_id)

    # If the book doesn't exist, return an error response
    if not existing_book:
      return {
        "success": False,
        "message": "Book not found"
      }

    # Try to delete the item from the DynamoDB table
    table.delete_item(
      Key={
        "PK": f"USER#{user_id}",
        "SK": f"BOOK#{book_id}"
      }
    )

    # Return success response with bookId
    return {
      "success": True,
      "bookId": book_id,
    }

  # If there's an error, print it and return an error response
  except Exception as error:
    print("Error deleting book:", error)
    return {
      "success": False,
      "message": "Something went wrong"
    }