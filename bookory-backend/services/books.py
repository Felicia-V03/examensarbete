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
  
def delete_book_by_id(user_id, book_id):
  try:
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