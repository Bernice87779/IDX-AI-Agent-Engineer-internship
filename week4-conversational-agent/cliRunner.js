// CLI entry point so OpenClaw's `exec` tool can invoke the conversational
// agent per WhatsApp message. Each call is a fresh process — session state
// persists via sessions-store.json (see sessionManager.js).
//
// Usage: node cliRunner.js "<userId>" "<message>"

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { handleTurn } = require("./conversationAgent");

async function main() {
  const userId = process.argv[2];
  const message = process.argv[3];

  if (!userId || !message) {
    console.error("Usage: node cliRunner.js \"<userId>\" \"<message>\"");
    process.exit(1);
  }

  try {
    const result = await handleTurn(userId, message);

    if (!result.done) {
      // Still gathering filters — just relay the follow-up question.
      console.log(JSON.stringify({ reply: result.response }));
    } else {
      // Search complete — format listings into a readable WhatsApp reply.
      if (!result.listings || result.listings.length === 0) {
        console.log(JSON.stringify({ reply: "No listings found matching those filters. Want to try a different search?" }));
      } else {
        const lines = result.listings.slice(0, 5).map((l) =>
          `${l.L_Address}, ${l.L_City} | $${l.price.toLocaleString()} | ${l.beds}bd/${l.baths}ba | ${l.sqft} sqft`
        );
        const reply = `Found ${result.listings.length} listing(s):\n\n${lines.join("\n")}`;
        console.log(JSON.stringify({ reply }));
      }
    }
  } catch (err) {
    console.error("FULL ERROR:", err);
    console.log(JSON.stringify({ reply: "Sorry, I hit an error searching. Please try again.", error: err.message }));
  }

  process.exit(0);
}

main();