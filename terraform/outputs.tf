output "dynamodb_table_name" {
  description = "Name of the DynamoDB table for user liked places"
  value       = aws_dynamodb_table.user_liked_places.name
}

output "dynamodb_table_arn" {
  description = "ARN of the DynamoDB table for user liked places"
  value       = aws_dynamodb_table.user_liked_places.arn
}

output "iam_role_arn" {
  description = "ARN of the IAM role for DynamoDB access"
  value       = aws_iam_role.dynamodb_access_role.arn
}

output "iam_role_name" {
  description = "Name of the IAM role for DynamoDB access"
  value       = aws_iam_role.dynamodb_access_role.name
}
