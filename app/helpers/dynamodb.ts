import { loggerError } from "./logger";

/**
 * Save a visited place to DynamoDB
 * @param email User's email
 * @param placeSlug Place slug identifier
 */
export async function saveVisitedPlace(
  email: string,
  placeSlug: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/visited-places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        place_slug: placeSlug,
      }),
    });

    return response.ok;
  } catch (error) {
    loggerError("Error saving visited place to DynamoDB:", error);
    return false;
  }
}

/**
 * Remove a visited place from DynamoDB
 * @param email User's email
 * @param placeSlug Place slug identifier
 */
export async function removeVisitedPlace(
  email: string,
  placeSlug: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/visited-places", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        place_slug: placeSlug,
      }),
    });

    return response.ok;
  } catch (error) {
    loggerError("Error removing visited place from DynamoDB:", error);
    return false;
  }
}

/**
 * Get all visited places for a user from DynamoDB
 * @param email User's email
 */
export async function getVisitedPlaces(email: string): Promise<string[]> {
  try {
    const response = await fetch(
      `/api/visited-places?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    loggerError("Error fetching visited places from DynamoDB:", error);
    return [];
  }
}
