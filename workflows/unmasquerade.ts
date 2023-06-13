import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { DetectPretenderFunction } from "../functions/detect_pretender.ts";

const workflow = DefineWorkflow({
  callback_id: "unmasquerade",
  title: "Unmasquerade",
  description: "なりすました人を看破する",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["interactivity", "channel", "user"],
  },
});

const formStep = workflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Unmasquerade",
    interactivity: workflow.inputs.interactivity,
    fields: {
      elements: [{
        name: "message_link",
        title: "なりすましを看破するメッセージのリンク",
        type: Schema.types.string,
      }],
      required: ["message_link"],
    },
  },
);

const functionStep = workflow.addStep(DetectPretenderFunction, {
  message_link: formStep.outputs.fields.message_link,
});

workflow.addStep(
  Schema.slack.functions.SendEphemeralMessage,
  {
    channel_id: workflow.inputs.channel,
    user_id: workflow.inputs.user,
    message: functionStep.outputs.result,
  },
);

export default workflow;
