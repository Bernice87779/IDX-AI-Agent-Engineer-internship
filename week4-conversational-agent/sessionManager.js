// Week 4 deliverable: multi-turn conversational session memory.
// Transforms the single-turn query tool from Week 3 into a stateful,
// progressively-refined conversation per user.

const sessions = new Map();

function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      city: null,
      maxPrice: null,
      beds: null,
      baths: null,
      type: null,
      pool: null,
      lastResults: null,
      conversationStep: 0,
    });
  }
  return sessions.get(userId);
}

function updateSession(userId, updates) {
  const session = getSession(userId);
  const updated = { ...session, ...updates };
  sessions.set(userId, updated);
  return updated;
}

function clearSession(userId) {
  sessions.delete(userId);
}

// Decide what to ask next based on what's still missing.
function getNextQuestion(session) {
  if (!session.city) return "What city are you interested in?";
  if (!session.maxPrice) return "What is your budget?";
  if (!session.type) return "Any preference — condo, townhome, or single family?";
  if (!session.beds) return "How many bedrooms minimum?";
  return null; // all key fields collected, ready to search
}

module.exports = { getSession, updateSession, clearSession, getNextQuestion };