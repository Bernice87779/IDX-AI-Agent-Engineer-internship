// Week 4 deliverable: conversational property search agent.
// Combines session memory with the Week 2 parser and Week 3 query layer.

const { getSession, updateSession, getNextQuestion, clearSession } = require("./sessionManager");
const { parsePropertyQuery } = require("../week2-nlp-parser/parsePropertyQuery");
const { searchActiveListings } = require("../src/db/propertyQueries");

// Fallback: when the parser can't extract anything from a short reply
// (e.g. user just says "Newport Beach" with no "in"), and we know which
// field we just asked about, treat the whole message as the answer.
function fallbackFillField(session, field, message) {
  const trimmed = message.trim();
  if (field === "city") return { city: trimmed };
  if (field === "type") {
    const typeMap = {
      condo: "Condominium",
      townhome: "Townhouse",
      townhouse: "Townhouse",
      "single family": "SingleFamilyResidence",
      land: "UnimprovedLand",
    };
    const key = Object.keys(typeMap).find((k) => trimmed.toLowerCase().includes(k));
    return { type: key ? typeMap[key] : trimmed };
  }
  if (field === "maxPrice") {
    const num = trimmed.replace(/[^0-9.]/g, "");
    if (num) return { maxPrice: Number(num) < 1000 ? Number(num) * 1000000 : Number(num) };
    return {};
  }
  if (field === "beds") {
    const num = trimmed.match(/\d+/);
    if (num) return { beds: Number(num[0]) };
    return {};
  }
  return {};
}

async function handleTurn(userId, message) {
  let session = getSession(userId);

  if (session.completed) {
    clearSession(userId);
    session = getSession(userId);
  }

  const parsed = parsePropertyQuery(message);

  let updates = {
    city: session.city || parsed.city,
    maxPrice: session.maxPrice || parsed.maxPrice,
    beds: session.beds || parsed.beds,
    baths: session.baths || parsed.baths,
    type: session.type || parsed.type,
    pool: session.pool || parsed.pool,
  };

  // If the parser found nothing new for the field we just asked about,
  // fall back to treating the raw message as the answer to that field.
  const askedField = session.lastAskedField;
  if (askedField && !updates[askedField] && !session[askedField]) {
    const fallback = fallbackFillField(session, askedField, message);
    updates = { ...updates, ...fallback };
  }

  const merged = updateSession(userId, {
    ...updates,
    conversationStep: session.conversationStep + 1,
  });

  const next = getNextQuestion(merged);
  if (next) {
    updateSession(userId, { lastAskedField: next.field });
    return { response: next.question, done: false };
  }

  const results = await searchActiveListings(merged);
  updateSession(userId, { lastResults: results, completed: true });

  return { response: null, listings: results, done: true };
}

module.exports = { handleTurn };