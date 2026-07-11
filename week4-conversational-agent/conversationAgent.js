// Week 4 deliverable: conversational property search agent.
// Combines session memory with the Week 2 parser and Week 3 query layer.

const { getSession, updateSession, getNextQuestion } = require("./sessionManager");
const { parsePropertyQuery } = require("../week2-nlp-parser/parsePropertyQuery");
const { searchActiveListings } = require("../src/db/propertyQueries");

async function handleTurn(userId, message) {
  const session = getSession(userId);

  // Parse whatever new info is in this message and merge into the session.
  const parsed = parsePropertyQuery(message);
  const merged = updateSession(userId, {
    city: session.city || parsed.city,
    maxPrice: session.maxPrice || parsed.maxPrice,
    beds: session.beds || parsed.beds,
    baths: session.baths || parsed.baths,
    type: session.type || parsed.type,
    pool: session.pool || parsed.pool,
    conversationStep: session.conversationStep + 1,
  });

  const nextQuestion = getNextQuestion(merged);
  if (nextQuestion) {
    return { response: nextQuestion, done: false };
  }

  // All key fields collected — run the actual search.
  const results = await searchActiveListings(merged);
  updateSession(userId, { lastResults: results });

  return { response: null, listings: results, done: true };
}

module.exports = { handleTurn };