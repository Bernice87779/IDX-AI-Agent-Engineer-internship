// Week 4 deliverable: multi-turn conversational session memory.
// Persisted to a JSON file instead of an in-memory Map, because each
// WhatsApp message triggers a brand-new `node` process via OpenClaw's
// exec tool — an in-memory Map would reset on every single message.
// This mirrors what the real "move state to Redis/a database" advice
// would look like in production, just using a plain file for this program.

const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "sessions-store.json");

function loadStore() {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

function saveStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function getSession(userId) {
  const store = loadStore();
  if (!store[userId]) {
    store[userId] = {
      city: null,
      maxPrice: null,
      beds: null,
      baths: null,
      type: null,
      pool: null,
      lastResults: null,
      conversationStep: 0,
    };
    saveStore(store);
  }
  return store[userId];
}

function updateSession(userId, updates) {
  const store = loadStore();
  const existing = store[userId] || {};
  const updated = { ...existing, ...updates };
  store[userId] = updated;
  saveStore(store);
  return updated;
}

function clearSession(userId) {
  const store = loadStore();
  delete store[userId];
  saveStore(store);
}

function getNextQuestion(session) {
  if (!session.city) return "What city are you interested in?";
  if (!session.maxPrice) return "What is your budget?";
  if (!session.type) return "Any preference — condo, townhome, or single family?";
  if (!session.beds) return "How many bedrooms minimum?";
  return null;
}

module.exports = { getSession, updateSession, clearSession, getNextQuestion };