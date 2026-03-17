from cerberus import Validator

login_Schema = {
  "email": {
    "type": "string",
    "regex": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    "required": True
  },
  "password": {
    "type": "string",
    "required": True
  }
}

validator = Validator(login_Schema)