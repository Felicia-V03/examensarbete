from cerberus import Validator

update_schema = {
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
    "regex": "^(\\+46|0)\\d{9}$",
    "required": False
  }
}

validator = Validator(update_schema)