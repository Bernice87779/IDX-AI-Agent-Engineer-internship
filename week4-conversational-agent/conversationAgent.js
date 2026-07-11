// Week 4 deliverable: conversational property search agent.
// Combines session memory with the Week 2 parser and Week 3 query layer.

const { getSession, updateSession, getNextQuestion, clearSession } = require("./sessionManager");
const { parsePropertyQuery } = require("../week2-nlp-parser/parsePropertyQuery");
const { searchActiveListings } = require("../src/db/propertyQueries");

async function handleTurn(userId, message) {
  let session = getSession(userId);

  // If the last conversation already completed a search, start fresh —
  // otherwise old filters (city, price, etc.) would silently carry over
  // into what the user intends as a brand-new search.
  if (session.completed) {
    clearSession(userId);
    session = getSession(userId);
  }

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

  const results = await searchActiveListings(merged);
  updateSession(userId, { lastResults: results, completed: true });

  return { response: null, listings: results, done: true };
}

module.exports = { handleTurn };