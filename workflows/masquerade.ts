import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

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
    },
    required: ["interactivity", "original_user"],
  },
});

workflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Masquerade",
    interactivity: workflow.inputs.interactivity,
    fields: {
      elements: [{
        name: "pretending_user",
        title: "なりすますユーザー",
        type: Schema.slack.types.user_id,
      }, {
        name: "message",
        title: "メッセージ",
        type: Schema.types.string,
        long: true,
      }],
      required: ["pretending_user", "message"],
    },
  },
);

export default workflow;
