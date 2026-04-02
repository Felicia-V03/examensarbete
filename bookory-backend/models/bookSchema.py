from cerberus import Validator

book_schema = {
  "open_library_id": {
    "type": "string",
    "minlength": 1,
    "required": True
  },
  "status": {
    "type": "string",
    "minlength": 1,
    "required": True
  },
  "pages": {
    "type": "string",
    "minlength": 1,
  },
  "overall_rating": {
    "type": "string",
    "minlength": 0,
    "max": 5
  },
  "spice_rating": {
    "type": "string",
    "minlength": 0,
    "max": 5
  },
  "fluff_rating": {
    "type": "string",
    "minlength": 0,
    "max": 5
  },
  "tear_rating": {
    "type": "string",
    "minlength": 0,
    "max": 5
  },
  "humor_rating": {
    "type": "string",
    "minlength": 0,
    "max": 5
  },
  "notes": {
    "type": "list",
    "schema": {
      "type": "dict",
      "schema": {
        "note": {
          "type": "string",
        },
        "page": {
          "type": "string",
          "min": 0,
        },
        "color": {
          "type": "string",
          "regex": "^#[0-9A-Fa-f]{6}$"
        },
      }
    }
  }
}

validator = Validator(book_schema)