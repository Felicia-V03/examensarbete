import boto3

client = boto3.resource(
  "dynamodb",
  region_name="eu-north-1",
)

table = client.Table("bookory-table")