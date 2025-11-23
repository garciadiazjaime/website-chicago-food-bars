import { NextRequest, NextResponse } from "next/server";
import {
  DynamoDBClient,
  PutItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

import { loggerInfo, loggerError } from "@/app/helpers/logger";

const dynamoClient = new DynamoDBClient({
  region: "us-east-1",
});

export async function POST(request: NextRequest) {
  try {
    const { email, place_slug } = await request.json();

    if (!email || !place_slug) {
      return NextResponse.json(
        { error: "Email and place_slug are required" },
        { status: 400 }
      );
    }

    loggerInfo("saving to DynamoDB:", { email, place_slug });

    const command = new PutItemCommand({
      TableName: "chicago-food-bars-user-likes",
      Item: {
        email: { S: email },
        place_slug: { S: place_slug },
        updated: { S: new Date().toISOString() },
      },
    });

    await dynamoClient.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    loggerError("Error saving to DynamoDB:", error);
    return NextResponse.json(
      { error: "Failed to save visited place" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email, place_slug } = await request.json();

    // Validate input
    if (!email || !place_slug) {
      return NextResponse.json(
        { error: "Email and place_slug are required" },
        { status: 400 }
      );
    }

    loggerInfo("deleting from DynamoDB:", { email, place_slug });

    const command = new DeleteItemCommand({
      TableName: "chicago-food-bars-user-likes",
      Key: {
        email: { S: email },
        place_slug: { S: place_slug },
      },
    });

    await dynamoClient.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    loggerError("Error deleting from DynamoDB:", error);
    return NextResponse.json(
      { error: "Failed to remove visited place" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    loggerInfo("querying DynamoDB for email:", email);

    const command = new QueryCommand({
      TableName: "chicago-food-bars-user-likes",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
    });

    const result = await dynamoClient.send(command);
    const placeSlugs =
      result.Items?.map((item) => item.place_slug?.S).filter(Boolean) || [];

    return NextResponse.json(placeSlugs);
  } catch (error) {
    loggerError("Error querying DynamoDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch visited places" },
      { status: 500 }
    );
  }
}
