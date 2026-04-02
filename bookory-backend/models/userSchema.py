from cerberus import Validator

user_schema = {
  "username": {
    "type": "string",
    "minlength": 6,
    "regex": "^[a-zA-Z0-9_]+$",
    "required": True
  },
  "password": {
    "type": "string",
    "minlength": 8,
    "regex": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).+$",
    "required": True
  },
  "email": {
    "type": "string",
    "regex": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    "required": True
  },
  "address": {
    "type": "string",
    "required": False
  },
  "phone": {
    "type": "string",
    "regex": "^\\+?[1-9]\\d{1,14}$",
    "required": False
  }
}

validator = Validator(user_schema)