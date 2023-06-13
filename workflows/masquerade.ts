import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SendMessageFunction } from "../functions/send_message.ts";

const workflow = DefineWorkflow({
  callback_id: "masquerade",
  title: "Masquerade",
  description: "他人になりすましたメッセージを投稿する",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      original_user: {
        type: Schema.slack.types.user_id,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity", "original_user", "channel"],
  },
});

const formStep = workflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Masquerade",
    interactivity: workflow.inputs.interactivity,
    fields: {
      elements: [{
        name: "pretend_user",
        title: "なりすますユーザー",
        type: Schema.slack.types.user_id,
      }, {
        name: "message",
        title: "メッセージ",
        type: Schema.slack.types.rich_text,
      }],
      required: ["pretend_user", "message"],
    },
  },
);

workflow.addStep(SendMessageFunction, {
  original_user: workflow.inputs.original_user,
  pretend_user: formStep.outputs.fields.pretend_user,
  channel: workflow.inputs.channel,
  message: formStep.outputs.fields.message,
});

export default workflow;
