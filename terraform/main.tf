terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  profile = "chicago-food-bars-profile"
}

# DynamoDB table for storing user liked places
resource "aws_dynamodb_table" "user_liked_places" {
  name           = "chicago-food-bars-user-likes"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "email"
  range_key      = "place_slug"

  attribute {
    name = "email"
    type = "S"
  }

  attribute {
    name = "place_slug"
    type = "S"
  }

  # Single GSI to query by place_slug (free tier allows 5 GSIs per table)
  global_secondary_index {
    name     = "PlaceSlugIndex"
    hash_key = "place_slug"
    
    projection_type = "KEYS_ONLY"  # Reduced projection to save storage
  }

  tags = {
    Name    = "ChicagoFoodBarsUserLikes"
    Project = var.project_name
  }
}

# IAM role for Lambda functions to access DynamoDB
resource "aws_iam_role" "dynamodb_access_role" {
  name = "chicago-food-bars-dynamodb-access"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name    = "ChicagoFoodBarsDynamoDBAccess"
    Project = var.project_name
  }
}

# IAM policy for DynamoDB operations
resource "aws_iam_policy" "dynamodb_policy" {
  name        = "chicago-food-bars-dynamodb-policy"
  description = "Policy for DynamoDB operations on user liked places table"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem"
        ]
        Resource = [
          aws_dynamodb_table.user_liked_places.arn,
          "${aws_dynamodb_table.user_liked_places.arn}/*"
        ]
      }
    ]
  })
}

# Attach policy to role
resource "aws_iam_role_policy_attachment" "dynamodb_policy_attachment" {
  role       = aws_iam_role.dynamodb_access_role.name
  policy_arn = aws_iam_policy.dynamodb_policy.arn
}
