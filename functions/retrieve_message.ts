import { SlackAPIClient } from "deno-slack-api/types.ts";

export async function retrieveMessage(
  client: SlackAPIClient,
  channel_id: string,
  message_ts: string,
) {
  const response = await client
    .conversations.history({
      channel: channel_id,
      oldest: message_ts,
      limit: 1,
      inclusive: true,
      include_all_metadata: true,
    }).then(async (response) => {
      if (!response.messages || response.messages.length === 0) {
        response = await client.conversations.replies({
          channel: channel_id,
          ts: message_ts,
          limit: 1,
          inclusive: true,
          include_all_metadata: true,
        });
      }

      return response;
    });

  if (response.error) {
    const error = `Failed to fetch the message due to ${response.error}`;
    throw new Error(error);
  }

  if (response.messages.length == 0) {
    throw new Error("No message found");
  }

  return response.messages[0];
}
