import Room from "../models/room.model";

/**
 * Save or update room map data to the database with a bulk operation.
 * @param roomCodeMap - A map containing roomId and corresponding codes.
 */
export async function saveRoomMap(
  roomCodeMap: Map<string, string>
): Promise<void> {
  try {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);

    // Transform the map into bulk operations
    const bulkOperations = Array.from(roomCodeMap).map(([roomId, code]) => ({
      updateOne: {
        filter: { room_id: roomId }, // Match documents with the same room_id
        update: {
          $set: { document: code, expiry_date: expiryDate },
        },
        upsert: true, // Insert the document if it doesn't exist
      },
    }));

    // Perform the bulk write
    const result = await Room.bulkWrite(bulkOperations, { ordered: false });

    console.log("Bulk operation completed successfully");
    console.log(
      `Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`
    );
  } catch (error: any) {
    console.error("Error performing bulk operation:", error.message);
  }
}
