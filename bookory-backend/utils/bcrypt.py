import bcrypt

saltRounds = 10

async def hash_Password(password: str) -> bytes:
  salt = bcrypt.gensalt(saltRounds)
  hashed_Password = bcrypt.hashpw(password.encode('utf-8'), salt)
  return hashed_Password

async def verify_Password(password: str, hashed_Password: bytes) -> bool:
  isEqual = bcrypt.checkpw(password.encode('utf-8'), hashed_Password)
  return isEqual