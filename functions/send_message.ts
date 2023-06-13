import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts ";

export const SendMessageFunction = DefineFunction({
  callback_id: "send_message",
  title: "Send Message",
  description: "Send message pretending be someone",
  source_file: "functions/send_message.ts",
  input_parameters: {
    properties: {
      original_user: {
        type: Schema.slack.types.user_id,
      },
      pretend_user: {
        type: Schema.slack.types.user_id,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      message: {
        type: Schema.types.string,
      },
    },
    required: ["original_user", "pretend_user", "channel", "message"],
  },
});

export default SlackFunction(
  SendMessageFunction,
  async ({ inputs, client }) => {
    const user = await client.users.profile.get({ user: inputs.pretend_user })
      .then(
        (response) => {
          if (!response.ok) {
            const message = `Failed to get user profile: ${response.error}`;
            console.warn(message);
          }

          return response;
        },
      );

    const response = await client.chat.postMessage({
      channel: inputs.channel,
      text: inputs.message,
      username: user.profile.real_name,
      icon_url: user.profile.image_1024,
    });

    if (!response.ok) {
      console.warn(`Failed to send message: ${response}, inputs: ${inputs}`);
    }

    return { outputs: {} };
  },
);
