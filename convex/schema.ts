import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    name: v.optional(v.string()), // Make optional for legacy data
    secretWord: v.optional(v.string()), // Make optional for legacy data
    animalCombination: v.optional(v.string()), // e.g., "პანტერაკატა"
    isWaitingForMatch: v.optional(v.boolean()), // Make optional for legacy data
    matchedWith: v.optional(v.id("players")),
    revealedSecretWord: v.optional(v.string()), // the other player's secret word after successful match
    createdAt: v.optional(v.number()), // Make optional to handle existing data
    // Legacy fields for backward compatibility
    playerId: v.optional(v.string()),
    playerName: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    hasSetWord: v.optional(v.boolean()),
    hasSubmittedGuess: v.optional(v.boolean()),
    currentAnimalGuess: v.optional(v.string()),
    encryptedSecretWord: v.optional(v.string()),
    revealedWord: v.optional(v.string()),
  }).index("by_animal_combination", ["animalCombination"])
    .index("by_waiting", ["isWaitingForMatch"])
    .index("by_name", ["name"]),

  matches: defineTable({
    player1Id: v.id("players"),
    player2Id: v.id("players"),
    animalCombination: v.string(),
    matchedAt: v.number(),
  }).index("by_players", ["player1Id", "player2Id"])
    .index("by_combination", ["animalCombination"]),

  // Legacy tables for backward compatibility
  gameSessions: defineTable({
    sessionId: v.optional(v.string()),
    player1Id: v.optional(v.id("players")),
    player2Id: v.optional(v.id("players")),
    status: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    playerCount: v.optional(v.number()), // Add missing field
  }),

  matchAttempts: defineTable({
    sessionId: v.optional(v.string()),
    playerId: v.optional(v.id("players")),
    animalCombination: v.optional(v.string()),
    timestamp: v.optional(v.number()),
    // Additional legacy fields
    attemptNumber: v.optional(v.number()),
    isMatch: v.optional(v.boolean()),
    player1Guess: v.optional(v.string()),
    player2Guess: v.optional(v.string()),
  }),
});