from cerberus import Validator

book_schema = {
  "title": {
    "type": "string",
    "minlength": 1,
    "required": True
  },
  "author": {
    "type": "string",
    "minlength": 1,
    "required": True
  },
  "published_year": {
    "type": "integer",
    "min": 0,
    "required": True
  },
  "isbn": {
    "type": "string",
    "regex": "^(97(8|9))?\d{9}(\d|X)$",
    "required": True
  },
  "genre": {
    "type": "string",
    "minlength": 1,
    "required": True
  }
}

validator = Validator(book_schema)