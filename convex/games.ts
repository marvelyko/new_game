import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Simple base64 encoding for obfuscation (works in V8 runtime)
function encrypt(text: string): string {
  return btoa(text);
}

function decrypt(encryptedText: string): string {
  return atob(encryptedText);
}

export const createPlayer = mutation({
  args: { 
    name: v.string(),
    secretWord: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if player with this name already exists and is still active
    const existingPlayer = await ctx.db
      .query("players")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existingPlayer) {
      // Update existing player
      await ctx.db.patch(existingPlayer._id, {
        name: args.name,
        secretWord: encrypt(args.secretWord),
        animalCombination: undefined,
        isWaitingForMatch: false,
        matchedWith: undefined,
        revealedSecretWord: undefined,
        createdAt: Date.now(),
      });
      return existingPlayer._id;
    }

    // Create new player
    const playerId = await ctx.db.insert("players", {
      name: args.name,
      secretWord: encrypt(args.secretWord),
      isWaitingForMatch: false,
      createdAt: Date.now(),
    });

    return playerId;
  },
});

export const submitAnimalCombination = mutation({
  args: {
    playerId: v.id("players"),
    animalCombination: v.string(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player || !player.secretWord) throw new Error("Player not found or invalid");

    // Update player with animal combination
    await ctx.db.patch(args.playerId, {
      animalCombination: args.animalCombination.toLowerCase().trim(),
      isWaitingForMatch: true,
      matchedWith: undefined,
      revealedSecretWord: undefined,
    });

    // Look for another player with the same animal combination
    const matchingPlayer = await ctx.db
      .query("players")
      .withIndex("by_animal_combination", (q) => 
        q.eq("animalCombination", args.animalCombination.toLowerCase().trim())
      )
      .filter((q) => 
        q.and(
          q.neq(q.field("_id"), args.playerId),
          q.eq(q.field("isWaitingForMatch"), true)
        )
      )
      .first();

    if (matchingPlayer && matchingPlayer.secretWord) {
      // We have a match! Exchange secret words
      const playerSecretWord = decrypt(player.secretWord);
      const matchingPlayerSecretWord = decrypt(matchingPlayer.secretWord);

      // Update both players with the exchanged secret words
      await ctx.db.patch(args.playerId, {
        isWaitingForMatch: false,
        matchedWith: matchingPlayer._id,
        revealedSecretWord: matchingPlayerSecretWord,
      });

      await ctx.db.patch(matchingPlayer._id, {
        isWaitingForMatch: false,
        matchedWith: args.playerId,
        revealedSecretWord: playerSecretWord,
      });

      // Record the match
      await ctx.db.insert("matches", {
        player1Id: args.playerId,
        player2Id: matchingPlayer._id,
        animalCombination: args.animalCombination.toLowerCase().trim(),
        matchedAt: Date.now(),
      });

      return {
        matched: true,
        matchedWith: matchingPlayer.name || "Unknown",
        revealedSecretWord: matchingPlayerSecretWord,
      };
    }

    return {
      matched: false,
      message: "ელოდება მეორე მოთამაშეს იგივე კომბინაციით...",
    };
  },
});

export const getPlayer = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player) return null;

    return {
      _id: player._id,
      name: player.name || "Unknown",
      animalCombination: player.animalCombination,
      isWaitingForMatch: player.isWaitingForMatch || false,
      matchedWith: player.matchedWith,
      revealedSecretWord: player.revealedSecretWord,
      createdAt: player.createdAt || Date.now(),
    };
  },
});

export const getPlayerByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query("players")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (!player) return null;

    return {
      _id: player._id,
      name: player.name || "Unknown",
      animalCombination: player.animalCombination,
      isWaitingForMatch: player.isWaitingForMatch || false,
      matchedWith: player.matchedWith,
      revealedSecretWord: player.revealedSecretWord,
      createdAt: player.createdAt || Date.now(),
    };
  },
});

export const getRecentMatches = query({
  args: {},
  handler: async (ctx) => {
    const matches = await ctx.db
      .query("matches")
      .order("desc")
      .take(10);

    const matchesWithPlayers = await Promise.all(
      matches.map(async (match) => {
        const player1 = await ctx.db.get(match.player1Id);
        const player2 = await ctx.db.get(match.player2Id);
        
        return {
          _id: match._id,
          player1Name: player1?.name || "Unknown",
          player2Name: player2?.name || "Unknown",
          animalCombination: match.animalCombination,
          matchedAt: match.matchedAt,
        };
      })
    );

    return matchesWithPlayers;
  },
});

export const resetPlayer = mutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, {
      animalCombination: undefined,
      isWaitingForMatch: false,
      matchedWith: undefined,
      revealedSecretWord: undefined,
    });
  },
});