from services.client import table
from datetime import datetime

def add_book(user_id, book_data):
  print("Adding book...", book_data)

  book_id = book_data.get("open_library_id")

  created_at = datetime.now().strftime("%Y-%m-%d %H:%M")

  # 🔥 convert notes → DynamoDB-friendly python structure
  notes = []
  if "notes" in book_data:
    for note in book_data["notes"]:
      notes.append({
        "note": note.get("note"),
        "page": note.get("page"),
        "color": note.get("color"),
      })

  # Build the attributes dict only including provided optional fields
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

  try:
    table.put_item(
      Item={
        "PK": f"USER#{user_id}",
        "SK": f"BOOK#{book_id}",
        "attributes": attributes,
      }
    )

    return {
      "success": True,
      "bookId": book_id,
      "createdAt": created_at
    }

  except Exception as error:
    print("Error adding book:", error)
    return False

def get_books(user_id):
  try:
    response = table.query(
      KeyConditionExpression="PK = :pk AND begins_with(SK, :sk_prefix)",
      ExpressionAttributeValues={
        ":pk": f"USER#{user_id}",
        ":sk_prefix": "BOOK#"
      }
    )

    items = response.get("Items", [])
    books = []

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

  except Exception as error:
    print("Error getting books:", error)
    return []

def get_book_by_id(user_id, book_id):
  try:
    response = table.get_item(
      Key={
        "PK": f"USER#{user_id}",
        "SK": f"BOOK#{book_id}"
      }
    )

    item = response.get("Item")
    if not item:
      return None

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

  except Exception as error:
    print("Error getting book:", error)
    return None
  
def get_book_by_status(user_id, status):
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

    items = response.get("Items", [])
    books = []

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

  except Exception as error:
    print("Error:", error)
    return []

def update_book_by_id(user_id, book_id, update_data):
  try:
    print("Incoming update_data:", update_data)

    # 🔹 Hantera notes
    notes = []
    if "notes" in update_data and isinstance(update_data["notes"], list):
      for note in update_data["notes"]:
        notes.append({
          "note": note.get("note"),
          "page": note.get("page"),
          "color": note.get("color"),
        })

    # 🔹 Tillåtna fält
    allowed_fields = [
      "status",
      "pages",
      "overall_rating",
      "spice_rating",
      "fluff_rating",
      "tear_rating",
      "humor_rating"
    ]

    # 🔹 Bygg attributes (det som ska in i DynamoDB)
    attributes = {}

    for field in allowed_fields:
      if field in update_data and update_data[field] is not None:
        attributes[field] = update_data[field]

    if notes:
      attributes["notes"] = notes

    print("Attributes to update:", attributes)

    # ❌ Skydda mot tom request
    if not attributes:
      return {
        "success": False,
        "message": "No fields to update"
      }

    # 🔥 VIKTIGT: uppdatera INSIDE attributes (nested!)
    update_expression = "SET " + ", ".join(
      f"#attr.#{k} = :{k}" for k in attributes
    )

    expression_attribute_values = {
      f":{k}": v for k, v in attributes.items()
    }

    expression_attribute_names = {
      "#attr": "attributes",   # 🔥 root map
      **{f"#{k}": k for k in attributes}  # 🔥 fix för reserved keywords (status)
    }

    print("UpdateExpression:", update_expression)

    # 🚀 DynamoDB update
    table.update_item(
      Key={
        "PK": f"USER#{user_id}",
        "SK": f"BOOK#{book_id}"
      },
      UpdateExpression=update_expression,
      ExpressionAttributeValues=expression_attribute_values,
      ExpressionAttributeNames=expression_attribute_names,
      ConditionExpression="attribute_exists(PK) AND attribute_exists(SK)"  # 🔥 stoppar nya items
    )

    return {
      "success": True,
      "bookId": book_id
    }

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

def delete_book_by_id(user_id, book_id):
  try:
    # Check if the book exists before attempting to delete
    existing_book = get_book_by_id(user_id, book_id)
    if not existing_book:
      return {
        "success": False,
        "message": "Book not found"
      }

    table.delete_item(
      Key={
        "PK": f"USER#{user_id}",
        "SK": f"BOOK#{book_id}"
      }
    )

    return {
      "success": True,
      "bookId": book_id,
    }

  except Exception as error:
    print("Error deleting book:", error)
    return False