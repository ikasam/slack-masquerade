import { Manifest } from "deno-slack-sdk/mod.ts";
import MasqueradeWorkflow from "./workflows/masquerade.ts";
import UnmasqueradeWorkflow from "./workflows/unmasquerade.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "Masquerade",
  description: "他人になりすましてメッセージを送信する",
  icon: "assets/default_new_app_icon.png",
  functions: [],
  workflows: [MasqueradeWorkflow, UnmasqueradeWorkflow],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "chat:write.customize",
    "users.profile:read",
    "channels:history",
  ],
});
