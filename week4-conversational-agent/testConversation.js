// Test: simulate two SEPARATE node process calls (like OpenClaw's exec
// tool would do for two different WhatsApp messages), to verify session
// state survives across process restarts via the JSON file store.

require("dotenv").config();
const { handleTurn } = require("./conversationAgent");

const TEST_USER = "test-user-886903345935";

async function main() {
  const turnArg = process.argv[2];

  if (turnArg === "1") {
    const result = await handleTurn(TEST_USER, "Find homes in Irvine");
    console.log("Turn 1 result:", JSON.stringify(result, null, 2));
  } else if (turnArg === "2") {
    const result = await handleTurn(TEST_USER, "Under 1.2M");
    console.log("Turn 2 result:", JSON.stringify(result, null, 2));
  } else if (turnArg === "3") {
    const result = await handleTurn(TEST_USER, "single family with 2 beds");
    console.log("Turn 3 result:", JSON.stringify(result, null, 2));
  } else {
    console.log("Usage: node testConversation.js 1   (or 2 or 3)");
  }
  process.exit(0);
}

main();