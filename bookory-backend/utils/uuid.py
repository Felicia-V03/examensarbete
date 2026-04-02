import uuid

def generate_uuid(count):
  return str(uuid.uuid4())[:count] 