import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import UnmasqueradeWorkflow from "../workflows/unmasquerade.ts";

const settingTrigger: Trigger<typeof UnmasqueradeWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "unmasquerade",
  description: "なりすました人を看破する",
  workflow: "#/workflows/unmasquerade",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
    user: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default settingTrigger;
