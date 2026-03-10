import bcrypt

saltRounds = 10

async def hashPassword(password: str) -> bytes:
  salt = bcrypt.gensalt(saltRounds)
  hashedPassword = bcrypt.hashpw(password.encode('utf-8'), salt)
  return hashedPassword

async def comparePassword(password: str, hashedPassword: bytes) -> bool:
  isEqual = bcrypt.checkpw(password.encode('utf-8'), hashedPassword)
  return isEqual