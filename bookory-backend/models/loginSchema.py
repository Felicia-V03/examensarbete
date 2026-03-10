from cerberus import Validator

loginSchema = {
  "username": {
    "type": "string",
    "minlength": 6,
    "regex": "^[a-zA-Z0-9_]+$",
    "required": True
  },
  "password": {
    "type": "string",
    "required": True
  }
}

validator = Validator(loginSchema)