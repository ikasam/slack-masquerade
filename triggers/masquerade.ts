import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import MasqueradeWorkflow from "../workflows/masquerade.ts";

const settingTrigger: Trigger<typeof MasqueradeWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "masquerade",
  description: "他人になりすましてメッセージを送信する",
  workflow: "#/workflows/masquerade",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    original_user: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default settingTrigger;
