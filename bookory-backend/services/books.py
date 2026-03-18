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
    "createdAt": created_at,
  }

  if "pages" in book_data:
    attributes["pages"] = book_data["pages"]
  if "overall_rating" in book_data:
    attributes["overall_rating"] = book_data["overall_rating"]
  if "spice_rating" in book_data:
    attributes["spice_rating"] = book_data["spice_rating"]
  if "fluff_rating" in book_data:
    attributes["fluff_rating"] = book_data["fluff_rating"]
  if "tear_rating" in book_data:
    attributes["tear_rating"] = book_data["tear_rating"]
  if "humor_rating" in book_data:
    attributes["humor_rating"] = book_data["humor_rating"]

  if notes:
    attributes["notes"] = notes

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