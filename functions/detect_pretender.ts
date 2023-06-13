import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts ";
import { retrieveMessage } from "./retrieve_message.ts";

export const DetectPretenderFunction = DefineFunction({
  callback_id: "detect_pretender",
  title: "Detect Pretender",
  description: "Detect who is pretending",
  source_file: "functions/detect_pretender.ts",
  input_parameters: {
    properties: {
      message_link: {
        type: Schema.types.string,
      },
    },
    required: ["message_link"],
  },
  output_parameters: {
    properties: {
      result: {
        type: Schema.types.string,
      },
    },
    required: ["result"],
  },
});

export default SlackFunction(
  DetectPretenderFunction,
  async ({ inputs, client }) => {
    const elements = inputs.message_link.split("/");
    const element_message_ts = elements.pop()?.substring(1);
    const message_ts = element_message_ts?.slice(0, 10) + "." +
      element_message_ts?.slice(-6);
    const channel_id = elements.pop();
    console.debug(
      `input: ${inputs.message_link}, channel_id: ${channel_id}, message_ts: ${message_ts}`,
    );

    if (channel_id === undefined || message_ts === undefined) {
      const error = `Failed to parse given permalink: ${inputs.message_link}`;
      console.error(error);
      return { error };
    }

    const message = await retrieveMessage(client, channel_id, message_ts);
    console.debug(message);

    if (message.metadata?.event_type !== "pretending_message") {
      return { outputs: { result: "このメッセージはなりすまされていません" } };
    }

    const original_user = message.metadata.event_payload.original_user;

    return {
      outputs: {
        result:
          `*<${inputs.message_link}|このメッセージ>は <@${original_user}> によってなりすまされています！！！*`,
      },
    };
  },
);
