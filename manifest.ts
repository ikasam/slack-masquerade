import { Manifest } from "deno-slack-sdk/mod.ts";
import MasqueradeWorkflow from "./workflows/masquerade.ts";

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
  workflows: [MasqueradeWorkflow],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
