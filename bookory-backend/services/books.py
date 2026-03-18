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